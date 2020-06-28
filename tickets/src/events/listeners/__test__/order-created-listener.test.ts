import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@yousuf85/common";

const testSetup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        price: 100,
        title: 'Test 01',
        userId: '343443'
    });
    await ticket.save();
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sddfdffd',
        expiresAt: new Date().toString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg};
}

describe('Order Created Listener', ()=> {
    it('Sets the order id of the ticket. ', async ()=> {
        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        const updatedTicket = await Ticket.findById(data.ticket.id);
        expect(updatedTicket!.orderId).toEqual(data.id);
    });
    
    it('calls the ack function', async ()=>{
        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    });

    it('publishes a ticket updated event', async ()=> {
        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();

    });
});