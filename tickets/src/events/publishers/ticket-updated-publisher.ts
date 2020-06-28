import { Subjects, Publisher, TicketUpdatedEvent } from '@yousuf85/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}