const DisplayOrders = ({orders}) => {
    return (
        <ul>
          {orders.map((order) => {
            return (
              <li key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
            );
          })}
        </ul>
      );
}

DisplayOrders.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/orders');

    return { orders: data}
}

export default DisplayOrders;