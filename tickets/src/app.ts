import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@yousuf85/common';
import { CreateTicketRouter, GetTicketRouter, GetAllTickets, UpdateTicketRouter } from './routes'

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);
app.use(CreateTicketRouter);
app.use(GetTicketRouter);
app.use(GetAllTickets);
app.use(UpdateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }