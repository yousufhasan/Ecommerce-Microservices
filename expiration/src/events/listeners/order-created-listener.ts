import { Listener, OrderCreatedEvent, Subjects } from '@yousuf85/common';
import { EXPIRATION_SVC_QUEUE_GROUP } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiraion-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    readonly subject = Subjects.OrderCreated;
    queueGroupName = EXPIRATION_SVC_QUEUE_GROUP;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`This job will be process after ${delay} seconds. `);
        await expirationQueue.add(
            {
              orderId: data.id,
            },
            {
              delay
            }
          );

        msg.ack();
    }
}