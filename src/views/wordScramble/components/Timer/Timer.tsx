import { Progress } from '@chakra-ui/react';
import { SSL_OP_NO_TICKET } from 'constants';
import React, { useEffect, useState } from 'react';


function Timer(props: any) {

    const {onTick, onTimeout, expireAtAndStartTime, locked=false, hidden=false} = props;

    const [timerValue, setTimerValue] = useState(100);

    useEffect(() => {
        if(locked === true) return;
        const expireAt = expireAtAndStartTime[0];
        const startTime = expireAtAndStartTime[1];
        const initialDiff = expireAt.getTime() - startTime.getTime();

        const interval = setInterval(() => {
           
            const diff = expireAt.getTime() - Date.now();

            setTimerValue((prev: number) => {
                const newVal = Math.max(0, (diff / (10 * initialDiff)) * 1000);
                if(newVal <= 0) {
                    clearInterval(interval);
                    //if(onTimeout) onTimeout();
                }
                return newVal;
            });

        }, 100);
        return () => clearInterval(interval);
    }, [locked, onTimeout, expireAtAndStartTime]);

    useEffect(() => {
        if(timerValue <= 0) {
            if(onTimeout) onTimeout();
        }
      }, [timerValue]);

    return (
        <Progress colorScheme="orange" size="xs" hidden={hidden} value={timerValue}/>
    );
}

export default Timer;