import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@yousuf85/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';

const testSetup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
    userId: '122323',
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, listener, ticket };
};

describe('Order Cancelled Listener', ()=> {
    it('Sets the order id to undefined', async () => {

        const { msg, data, listener, ticket } = await testSetup();
        await listener.onMessage(data, msg);
        const updatedTicket = await Ticket.findById(ticket.id);
        expect(updatedTicket!.orderId).not.toBeDefined();
    });

        
    it('calls the ack function', async ()=>{

        const { msg, data, listener } = await testSetup();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    });

    it('publishes a ticket updated event', async ()=> {

        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });

});