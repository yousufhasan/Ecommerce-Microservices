import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@yousuf85/common";
import { Ticket } from '../../../models';


const setupTest = async () => {
    const existingTicket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 50,
        title: 'Test'
    });
    await existingTicket.save();

    const listener = new TicketUpdatedListener(natsWrapper.client);
    const data: TicketUpdatedEvent['data'] = {
        id: existingTicket.id,
        price: 100,
        title: 'UpdatedTest',
        version: 1,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn()
    }

    return {listener, data, msg, existingTicket};

};

describe('TicketUpdatedListener', ()=>{

    it('throws an error when data with wrong version is passed ', async ()=> {
        const {listener, data, msg} = await setupTest();
        data.version = 5;
        await expect(listener.onMessage(data, msg)).rejects.toThrow();
        expect(msg.ack).not.toHaveBeenCalled();

    });

    it('updates a ticket on valid data', async ()=>{

       const {listener, data, msg, existingTicket} = await setupTest();
       await listener.onMessage(data, msg);
       const ticket = await Ticket.findById(existingTicket.id);

       expect(ticket).toBeDefined();
       expect(ticket!.title).toEqual(data.title);
       expect(ticket!.price).toEqual(data.price);
       expect(ticket!.version).toEqual(data.version);
       expect(msg.ack).toHaveBeenCalled();

    });

    it('calls the ack function', async ()=>{

        const {listener, data, msg} = await setupTest();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
})