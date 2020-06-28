import request from 'supertest';
import {app} from '../../app';

const createTicket= (title: string, price: number)=> {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title, price
        });
}
describe('Get Tickets', ()=>{
    it('can fetch a list of tickets', async ()=>{
        await createTicket('abc', 10);
        await createTicket('test', 10);
        await createTicket('sddsds', 10);

        const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
        
        expect(response.body.length).toEqual(3);

    });
})