import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@yousuf85/common";
import { Ticket } from '../../../models';


const setupTest = () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: 'test',
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn()
    }

    return {listener, data, msg};

};

describe('TicketCreatedListener', ()=>{
    it('Creates a ticket on valid data', async ()=>{
       const {listener, data, msg} = setupTest();
        await listener.onMessage(data, msg);
       const ticket = await Ticket.findById(data.id);
       expect(ticket).toBeDefined();
       expect(ticket!.title).toEqual('test');
       expect(msg.ack).toHaveBeenCalled();

    });

    it('calls the ack function', async ()=>{
        const {listener, data, msg} = setupTest();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    });
})