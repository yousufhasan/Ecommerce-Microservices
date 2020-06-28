import { TicketList } from '../components';

const LandingPage = ({tickets}) => {
    return <TicketList tickets={tickets} />
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {data} =  await client.get('/api/tickets');
  return {tickets: data}
}

export default LandingPage;