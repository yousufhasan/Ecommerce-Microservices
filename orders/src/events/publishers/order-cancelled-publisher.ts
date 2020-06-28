import { Publisher, OrderCancelledEvent, Subjects } from '@yousuf85/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
   readonly subject = Subjects.OrderCancelled;
}