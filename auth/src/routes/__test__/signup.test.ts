import request from 'supertest';
import { app } from '../../app';

describe('Signup Route', () => {
    it('returns a status code of 201 when passing a valid data', async ()=> {
        return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);
    });
    
    it('return a status code of 400 when passing invalid email', async ()=> {
        return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: '123456'
        })
        .expect(400);
    });

    it('return a status code of 400 when passing invalid password', async ()=> {
        return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123'
        })
        .expect(400);
    });

    it('return a status code of 400 when missing email or password ', async ()=> {
        await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);

        await request(app)
        .post('/api/users/signup')
        .send({
            password: '123456'
        })
        .expect(400);
    });

    it('doesnt allow duplicate email ', async ()=> {

       await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);

       await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(400);
    });

    it('sets a cookie after successfull signup ', async ()=> {
        const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(201);
        
        expect(response.get('Set-Cookie')).toBeDefined();

    });

});
