import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@yousuf85/common';
import { CreatePaymentRouter } from './routes/create-payment';

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
app.use(CreatePaymentRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }