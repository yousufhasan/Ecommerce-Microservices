import express, { Request, Response} from 'express';
import { requireAuth, validateRequest, NotFoundError, NotAuthroizedError, OrderStatus, BadRequestError } from '@yousuf85/common';
import { body } from 'express-validator';
import { Order, Payment } from '../models';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments',
requireAuth,
[
    body('token')
    .notEmpty()
    .withMessage('Payment token is required'),
    body('orderId')
    .notEmpty()
    .withMessage('OrderID is required')
],
validateRequest,
async (req: Request, res: Response)=>{
    
    const { token, orderId} = req.body;
    const order = await Order.findById(orderId);

    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthroizedError();
    }
    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for the expired order. ');
    }

    const charge = await stripe.charges.create({
        currency: 'aud',
        amount: order.price * 100,
        source: token
    });
    
    const payment = Payment.build({
        chargeId: charge.id,
        orderId: order.id
    })
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        chargeId: charge.id,
        orderId: order.id,
        id: payment.id,
    });

    res.status(201).send({payment});

});

export { router as CreatePaymentRouter };