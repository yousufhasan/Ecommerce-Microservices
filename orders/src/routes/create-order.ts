import express, { Request, Response} from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@yousuf85/common';
import { body } from 'express-validator';
import { Ticket, Order} from '../models';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers';

const router = express.Router();
const EXPIRATION_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .notEmpty()
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response)=> {

    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError('Ticket with this id is already reserved.');
    }

    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        ticket
    })
    await order.save();

    const publisher = new OrderCreatedPublisher(natsWrapper.client);
    publisher.publish({
        id: order.id,
        version: order.version,
        expiresAt: order.expiresAt.toISOString(),
        status: order.status,
        userId: order.userId,
        ticket: {
            id: ticketId,
            price: ticket.price
        }
    });

    res.status(201).send(order);
});

export { router as createOrderRouter}