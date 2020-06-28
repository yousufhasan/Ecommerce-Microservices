import { Publisher, OrderCreatedEvent, Subjects } from '@yousuf85/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}