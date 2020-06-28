import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from "@yousuf85/common";
import { ORDER_SVC_QUEUE_GROUP } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
   
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = ORDER_SVC_QUEUE_GROUP;
    
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if(!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Completed
        });
        order.save();
        
        msg.ack();
    }
}