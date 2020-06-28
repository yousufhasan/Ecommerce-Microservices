import { PaymentCreatedEvent, Publisher, Subjects } from "@yousuf85/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}