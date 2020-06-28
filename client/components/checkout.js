import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../hooks/use-request';

export const Checkout = ({order, email}) => {
    const [doRequest, errors] = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders'),
    });

    return (
        <div>
            <StripeCheckout 
            token = {({id}) => doRequest({token: id})} 
            stripeKey = {process.env.PAY_KEY}
            amount = {order.ticket.price * 100}
            email = {email}
            />
            {errors}
        </div>
    );
}