import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';

describe('Get Ticket',() => {

    it('returns a 404 if ticket is not found.', async ()=> {
        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app).get(`/api/tickets/${id}`).send().expect(404);
    });
    
    it('returns the ticket if ticket is found. ',async ()=> {
       const response =  await request(app)
       .post('/api/tickets')
       .set('Cookie', global.getAuthCookie())
       .send({
           title: 'test',
           price: 10
       });                
        await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
        
    });
});