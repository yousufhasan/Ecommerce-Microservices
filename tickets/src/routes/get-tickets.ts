import express, {Request, Response} from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@yousuf85/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {

    const tickets = await Ticket.find({
        orderId: undefined
    }); //only show tickets which are not reserved.
    if(!tickets){
        throw new NotFoundError();
    }
    
    res.send(tickets);
});

export {router as GetAllTickets}