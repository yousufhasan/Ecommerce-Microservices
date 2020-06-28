import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID is not defined.");
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID is not defined.");
    }
    if(!process.env.NATS_URL){
        throw new Error("NATS_URL is not defined.");
    }
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close',()=>{
            console.log('NATS Connection is closed !!');
            process.exit();
        });
        process.on('SIGINT', ()=> natsWrapper.client.close());
        process.on('SIGTERM', ()=> natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    }catch(err){
        console.log(err);
    }
}

start();

