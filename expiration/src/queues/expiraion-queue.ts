import Queue from 'bull';
import { ExpirationCompletedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
      host: process.env.REDIS_HOST,
    },
  });

  
expirationQueue.process(async (job) => {
        console.info('Processing job with Order ID : ', job.data.orderId);
        new ExpirationCompletedPublisher(natsWrapper.client).publish({
          orderId: job.data.orderId
        });

});

export { expirationQueue }