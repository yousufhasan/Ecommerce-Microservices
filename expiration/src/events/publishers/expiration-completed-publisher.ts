import { Publisher, ExpirationCompletedEvent, Subjects } from "@yousuf85/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    readonly subject= Subjects.ExpirationCompleted;
}