import express, { Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import {body} from 'express-validator';
import { requireAuth, NotFoundError, NotAuthroizedError, validateRequest, BadRequestError } from '@yousuf85/common';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers';

const router = express.Router();

router.put('/api/tickets/:id',
 requireAuth,
[
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Please provide a valid Price')
],
validateRequest,
async (req: Request, res: Response)=> {

    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthroizedError();
    }

    if(ticket.orderId){
        throw new BadRequestError('Cannot edit a reserved ticket.');
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })
    await ticket.save();
    const publisher = new TicketUpdatedPublisher(natsWrapper.client);
    publisher.publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.send(ticket);
});

export {router as UpdateTicketRouter}