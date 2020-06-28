import express, { Request, Response} from 'express';
import { requireAuth, NotFoundError, NotAuthroizedError } from '@yousuf85/common';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response)=> {
    const order = await Order.findById(req.params.id).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthroizedError();
    }
    res.send(order);
});

export { router as getOrderRouter}