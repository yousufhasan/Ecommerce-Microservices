import { Listener, ExpirationCompletedEvent, Subjects, NotFoundError, OrderStatus } from "@yousuf85/common";
import { ORDER_SVC_QUEUE_GROUP } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import { OrderCancelledPublisher } from "../publishers";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
   
    readonly subject = Subjects.ExpirationCompleted;
    readonly queueGroupName = ORDER_SVC_QUEUE_GROUP;
   
    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message){

       const order = await Order.findById(data.orderId).populate('ticket');
       if(!order){
           throw new NotFoundError();
       }
       if(order.status === OrderStatus.Completed){
           return msg.ack();
       }
       order.set({
           status: OrderStatus.Cancelled
       });

       await order.save();
       await new OrderCancelledPublisher(this.client).publish({
           id: order.id,
           ticket: {
               id: order.ticket.id
           },
           version: order.version,
       });
       msg.ack();
    }
}