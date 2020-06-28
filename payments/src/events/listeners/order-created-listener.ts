import { Listener, OrderCreatedEvent, Subjects } from "@yousuf85/common";
import { PAYMENTS_SVC_QUEUE_GROUP } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    queueGroupName = PAYMENTS_SVC_QUEUE_GROUP;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });
        await order.save();
        
        msg.ack();
    }
}

export { OrderCreatedListener }