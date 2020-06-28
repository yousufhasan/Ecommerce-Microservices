import { Message } from 'node-nats-streaming';
import { Listener, TicketUpdatedEvent, Subjects } from '@yousuf85/common';
import { ORDER_SVC_QUEUE_GROUP } from './queue-group-name';
import { Ticket } from '../../models';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    readonly subject = Subjects.TicketUpdated;
    queueGroupName = ORDER_SVC_QUEUE_GROUP;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const { title, price } = data;

        const ticket = await Ticket.findByIdAndPreviousVersion(data);
        if(!ticket){
            throw new Error('Ticket not found');
        }

        ticket.price = price;
        ticket.title = title;
        await ticket.save();

        msg.ack();
    }
}