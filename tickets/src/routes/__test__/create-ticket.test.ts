import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('create ticket', () => {
    it('has a route handler listening for /api/tickets for post requests ', async ()=>{
        const response = await request(app)
        .post('/api/tickets')
        .send({});
        expect(response.status).not.toEqual(404);
    });

    it('throws an error if user is not signed in ', async ()=>{

        await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)

    });

    it('send an status code other than 401 if user is signed in ', async ()=>{

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({});

        expect(response.status).not.toEqual(401);

    });

    it('throws an error if invalid title is provided. ', async ()=>{
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    });

    it('throws an error if invalid price is provided ', async ()=>{
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'test',
            price: -10
        })
        .expect(400);

    });

    it('creates a ticket if valid arguments are provided ', async ()=>{

        let tickets = await Ticket.find({});
        expect(tickets.length).toEqual(0);

        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'test',
            price: 10
        })
        .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
    });

    it('publishes a ticket created event', async ()=>{
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'test',
            price: 10
        })
        .expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});