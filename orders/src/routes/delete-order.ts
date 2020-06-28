import express, { Request, Response} from 'express';
import { requireAuth, OrderStatus, NotFoundError, NotAuthroizedError } from '@yousuf85/common';
import { Order } from '../models';
import { OrderCancelledPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response)=> {
    const order = await Order.findById(req.params.id).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthroizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });
    
    res.send(order);
});

export { router as deleteOrderRouter}