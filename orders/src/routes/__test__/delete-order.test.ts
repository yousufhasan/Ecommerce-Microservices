import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import {OrderStatus} from '@yousuf85/common';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

describe('DeleteOrder Route', ()=>{

    it('marks an order as cancelled', async () => {
        // create a ticket with Ticket Model
        const ticket = Ticket.build({
          id:  mongoose.Types.ObjectId().toHexString(),
          title: 'concert',
          price: 20,
        });
        await ticket.save();
      
        const user = global.getAuthCookie();
        // make a request to create an order
        const { body: order } = await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({ ticketId: ticket.id })
          .expect(201);
      
        // make a request to cancel the order
        await request(app)
          .delete(`/api/orders/${order.id}`)
          .set('Cookie', user)
          .send();
      
        // expectation to make sure the thing is cancelled
        const updatedOrder = await Order.findById(order.id);
      
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
      });
      it('emits a order cancelled event', async () => {
        
        const ticket = Ticket.build({
          id:  mongoose.Types.ObjectId().toHexString(),
          title: 'concert',
          price: 20,
        });
        await ticket.save();
      
        const user = global.getAuthCookie();
        // make a request to create an order
        const { body: order } = await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({ ticketId: ticket.id })
          .expect(201);
      
        // make a request to cancel the order
        await request(app)
          .delete(`/api/orders/${order.id}`)
          .set('Cookie', user)
          .send();
      
        expect(natsWrapper.client.publish).toHaveBeenCalled();
      });
});

