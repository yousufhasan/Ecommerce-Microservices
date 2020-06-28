import { TicketCreatedEvent, Subjects, Publisher } from '@yousuf85/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}