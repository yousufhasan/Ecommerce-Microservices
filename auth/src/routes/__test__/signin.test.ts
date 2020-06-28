import request from 'supertest';
import { app } from '../../app';

describe('SignIn Route', () => {
    it('fails when an invlaid email is supplied', async ()=>{
        return request(app)
        .post('/api/users/signin')
        .send({
            email: 'testabc@test.com',
            password: '123456'
        })
        .expect(400);
    });

    it('fails when an incorrect password is supplied', async ()=>{

        await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);

        await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '1256'
        })
        .expect(400);
    });

    it('responds with a cookie when passing valid credentials', async ()=>{

        await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);

       const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
    });

});