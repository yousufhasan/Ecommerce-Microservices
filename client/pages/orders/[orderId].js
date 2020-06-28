import { DisplayTimer, Checkout } from '../../components';

const DisplayOrder = ({order, currentUser}) => {
    return (
        <div> 
            <DisplayTimer expiryTime={order.expiresAt} /> 
            <Checkout order={order} email={currentUser.email} />
        </div>
        );
}

DisplayOrder.getInitialProps = async (context, client, currentUser) => {

    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data }
}
export default DisplayOrder;