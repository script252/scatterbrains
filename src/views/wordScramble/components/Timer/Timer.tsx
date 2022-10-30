import { Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';


function Timer(props: any) {

    const {onTimeout, expireAtAndStartTime} = props;

    const [timerValue, setTimerValue] = useState(100);
    //const [startTime, setStartTime] = useState(new Date(Date.now()));
    

    useEffect(() => {

        const expireAt = expireAtAndStartTime[0];
        const startTime = expireAtAndStartTime[1];

        //const startTime = new Date();
        const initialDiff = expireAt.getTime() - startTime.getTime();
        console.log('Exp at, start time:', expireAt, startTime);

        const interval = setInterval(() => {
           
            const diff = expireAt.getTime() - Date.now();
            
            //console.log('Exp at, now:', expireAt.getTime(), Date.now());
            //console.log('Diff and initDiff: ', diff, initialDiff);

            setTimerValue((prev: number) => {
                //console.log('Timer value:', prev);
                const newVal = Math.max(0, (diff / (10 * initialDiff)) * 1000);
                if(newVal <= 0) {
                    clearInterval(interval);
                    if(onTimeout) onTimeout();
                }
                return Math.max(0, (diff / (10 * initialDiff)) * 1000);
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [onTimeout, timerValue, expireAtAndStartTime]);

    return (
        <Progress value={timerValue}/>
    );
}

export default Timer;