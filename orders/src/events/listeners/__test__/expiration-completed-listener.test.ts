import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { OrderStatus, ExpirationCompletedEvent } from '@yousuf85/common';
import { Ticket, Order } from '../../../models';
import { natsWrapper } from '../../../nats-wrapper';

const setupTest = async () => {

    const listener = new ExpirationCompletedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
      });
      await ticket.save();
      const order = Order.build({
        status: OrderStatus.Created,
        userId: 'test',
        expiresAt: new Date(),
        ticket,
      });
      await order.save();
    
      const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id,
      };
    
      // @ts-ignore
      const msg: Message = {
        ack: jest.fn(),
      };
    
      return { listener, order, data, msg };
}

describe('ExpirationCompletedListener', ()=>{

    it('updates the order status to cancelled', async () => {
        
        const { listener, order, data, msg } = await setupTest();   
        await listener.onMessage(data, msg); 
        const updatedOrder = await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
      });
      
      it('emit an OrderCancelled event', async () => {

        const { listener, order, data, msg } = await setupTest();      
        await listener.onMessage(data, msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
      
        const eventData = JSON.parse(
          (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
        );
        expect(eventData.id).toEqual(order.id);
      });
      
      it('calls the ack function', async () => {
          
        const { listener, data, msg } = await setupTest();
        await listener.onMessage(data, msg);     
        expect(msg.ack).toHaveBeenCalled();
      });
});