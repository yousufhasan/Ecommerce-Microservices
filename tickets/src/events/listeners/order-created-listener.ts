import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from "@yousuf85/common";
import { Message } from "node-nats-streaming";
import { TICKET_SVC_QUEUE_GROUP } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    readonly subject = Subjects.OrderCreated;
    queueGroupName = TICKET_SVC_QUEUE_GROUP;

    async onMessage(data: OrderCreatedEvent['data'], message: Message){

       const ticket = await Ticket.findById(data.ticket.id);
       if(!ticket){
           throw new NotFoundError();
       }
       ticket.orderId = data.id;
       await ticket.save();

       await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
       });

       message.ack();
    }
}