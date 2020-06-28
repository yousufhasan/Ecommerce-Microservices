import { Ticket } from '../ticket';

describe('Ticket Mode', ()=> {
    it('implements optimistic concurrency control ', async ()=>{
        const ticket = Ticket.build({
            price: 5,
            title: 'test 01',
            userId: '123'
        });
        await ticket.save();

        const first = await Ticket.findById(ticket.id);
        const second = await Ticket.findById(ticket.id);

        first!.price = 10;
        second!.price = 20;

        await first!.save();
        await expect(second!.save()).rejects.toThrow();

    });

    it('increments the version number every time we save the record', async()=>{

        const ticket = Ticket.build({
            price: 5,
            title: 'test 01',
            userId: '123'
        });
        await ticket.save();
        expect(ticket.version).toEqual(0);
        await ticket.save();
        expect(ticket.version).toEqual(1);
        await ticket.save();
        expect(ticket.version).toEqual(2);

    })

});