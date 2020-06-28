import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@yousuf85/common";
import { Order } from '../../../models/order';

const testSetup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sddfdffd',
        expiresAt: new Date().toString(),
        ticket: {
            id: 'dfdfdf34',
            price: 100
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg};
}

describe('Order Created Listener', ()=> {
    it('creates an order ', async ()=> {

        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        const order = await Order.findById(data.id);

        expect(order!.id).toEqual(data.id);
        expect(order!.price).toEqual(data.ticket.price);
    });
    
    it('calls the ack function', async ()=>{

        const {listener, data, msg } = await testSetup();
        await listener.onMessage(data, msg);
        
        expect(msg.ack).toHaveBeenCalled();
    });

});