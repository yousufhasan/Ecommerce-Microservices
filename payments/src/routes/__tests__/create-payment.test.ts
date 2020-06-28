import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@yousuf85/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models';

jest.mock('../../stripe');
describe('CreatePaymentRouter', ()=> {

    it('throws a 404 error if an order doesnot exist', async ()=>{
        
        await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie())
        .send({
            token: '343434',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
    });

    it('throws a 401 error when paying with the different user', async ()=>{
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId: mongoose.Types.ObjectId().toHexString(),
            price: 100,
            status: OrderStatus.Created,
            version: 0
        });
        await order.save();

        await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie())
        .send({
            token: '343434',
            orderId: order.id
        })
        .expect(401);
    });

    it('throws a 400 when paying for a cancelled order', async ()=>{

        const userId = mongoose.Types.ObjectId().toHexString();
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId: userId,
            price: 100,
            status: OrderStatus.Cancelled,
            version: 0
        });
        await order.save();

        await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie(userId))
        .send({
            token: '343434',
            orderId: order.id
        })
        .expect(400);
    });
    it('returns a 201 when providing valid arguments', async ()=> {

        const userId = mongoose.Types.ObjectId().toHexString();
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId: userId,
            price: 10,
            status: OrderStatus.Created,
            version: 0
        });
        await order.save();

        await request(app)
        .post('/api/payments')
        .set('Cookie', global.getAuthCookie(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

        const stripeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
        expect(stripeOptions.source).toEqual('tok_visa');
        expect(stripeOptions.amount).toEqual(10 * 100);
        expect(stripeOptions.currency).toEqual('aud');

    });


});