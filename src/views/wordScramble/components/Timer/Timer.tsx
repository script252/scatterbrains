import { Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';


function Timer(props: any) {

    const {onTimeout, expireAt} = props;

    const [timerValue, setTimerValue] = useState(100);

    const startTime = new Date();

    useEffect(() => {

        
        const initialDiff = Math.abs(expireAt.getTime() - startTime.getTime());

        const interval = setInterval(() => {
           
            const diff = Math.abs(expireAt.getTime() - new Date().getTime());
            
            console.log('Diff and initDiff: ', diff, initialDiff);

            if(diff <= 0) {
                clearInterval(interval);
                setTimerValue(0);
                if(onTimeout) onTimeout();
            }

            setTimerValue((prev: number) => {
                console.log('Timer value:', prev);
                return (initialDiff/diff) * 100;//timerValue * (100/initialDiff);
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [onTimeout, timerValue, expireAt]);

    return (
        <Progress value={timerValue}/>
    );
}

export default Timer;