import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

jest.mock('../../nats-wrapper');
describe('Update Ticket', ()=> {
    it('returns a 404 if the provided id doesnot exist', async ()=> {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: "test",
            price: 200
        })
        .expect(404);
    });
    it('returns a 401 if the user is not authenticated', async ()=> {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "test",
            price: 200
        })
        .expect(401);

    });
    it('returns a 401 if the user does not own the ticket', async ()=> {

       const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: "test",
            price: 200
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: "test12",
            price: 2000
        })
        .expect(401);

    });
    it('returns a 400 if the user provide invalid title or price', async ()=> {
        const cookie = global.getAuthCookie();
        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "test",
            price: 200
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "",
            price: 200
        })
        .expect(400);

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "ddsds",
            price: -200
        })
        .expect(400);

    });

    it('returns a 400 if a ticket is reserved', async ()=> {
        const cookie = global.getAuthCookie();
        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "test",
            price: 200
        });

        const ticket = await Ticket.findById(response.body.id);
        ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
        await ticket!.save();
      
        await request(app)
          .put(`/api/tickets/${response.body.id}`)
          .set('Cookie', cookie)
          .send({
            title: 'updated test',
            price: 100,
          })
          .expect(400);
     });

    it('Updates the ticket if valid arguments are provided', async ()=> {

        const cookie = global.getAuthCookie();
        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "test",
            price: 200
        });

        const updateTikcetResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "test update",
            price: 100
        })
        .expect(200);

        expect(updateTikcetResponse.body.title).toEqual('test update');

    });
    it('publishes a ticket updated event', async ()=>{
        const cookie = global.getAuthCookie();
        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: "test",
            price: 200
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: "test update",
            price: 100
        })
        .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});