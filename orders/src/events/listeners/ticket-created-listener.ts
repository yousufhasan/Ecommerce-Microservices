import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@yousuf85/common';
import { ORDER_SVC_QUEUE_GROUP } from './queue-group-name';
import { Ticket } from '../../models';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    readonly subject = Subjects.TicketCreated;
    queueGroupName = ORDER_SVC_QUEUE_GROUP;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        const {id, title, price} = data;
        const ticket = Ticket.build({ id, price, title });
        await ticket.save();

        msg.ack();
    }
}