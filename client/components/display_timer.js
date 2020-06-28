import { useState, useEffect } from 'react';

export const DisplayTimer = ({expiryTime})=>{

    const [timer, setTimer] = useState('');

    useEffect(()=>{

        const calculateTimeLeft = () => {
            const msTimeLeft = new Date(expiryTime) - new Date();
            const minutes = Math.round(msTimeLeft/60000);
            const seconds = Math.round(msTimeLeft % 60000 / 1000);
            const timer = `Order expires in: ${minutes} minutes and ${seconds} seconds.`

            setTimer(msTimeLeft > 0 ? timer : 'Order Expired');
        };

        calculateTimeLeft();
        const timerId = setInterval(calculateTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, []);

    return  <p> {timer} </p>
};