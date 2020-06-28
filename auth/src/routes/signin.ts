import express,  { Request, Response }  from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@yousuf85/common';
import { User } from '../models/users';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid Email. '),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Please provide a password. ')
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError('Invalid Email or Password');
    }
    const isValidPassword = await Password.compare(existingUser.password, password);
    if(!isValidPassword){
        throw new BadRequestError('Invalid Email or Password');
    }

     //Generate JWT
     const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);
    // Store it on the cookie session object
    req.session!['jwt'] = userJwt;
    res.status(201).send(existingUser);
});

export { router as signinRouter };