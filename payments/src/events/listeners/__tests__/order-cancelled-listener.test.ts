import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@yousuf85/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/order';

const testSetup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 100,
    userId: '5666',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '344343',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

describe('Order Cancelled Listener', ()=> {
    it('updates the status of the order', async () => {

        const { listener, data, msg, order } = await testSetup();
        await listener.onMessage(data, msg);
        const updatedOrder = await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });
  
    it('calls the ack function', async ()=>{

        const { listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    });
});