import { Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function Timer(props: any) {

    const {value, onTick, onTimeout, expireAtAndStartTime, locked=false, hidden=false} = props;

    const [timerValue, setTimerValue] = useState(value);

    useEffect(() => {
        if(locked === true || hidden === true) return;
        const expireAt = expireAtAndStartTime[0];
        const startTime = expireAtAndStartTime[1];
        const initialDiff = expireAt.getTime() - startTime.getTime();

        const interval = setInterval(() => {
           
            const diff = expireAt.getTime() - Date.now();

            setTimerValue((prev: number) => {
                const newVal = Math.max(0, (diff / (10 * initialDiff)) * 1000);
                if(newVal <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return newVal;
            });

        }, 250);
        return () => clearInterval(interval);
    }, [locked, onTimeout, expireAtAndStartTime, hidden]);

    useEffect(() => {
        if(locked === true || hidden === true) return;
        if(timerValue <= 0) {
            if(onTick) onTick(timerValue);
            if(onTimeout) onTimeout();
            setTimerValue(100);
        } else {

            if(onTick) onTick(timerValue);
        }
      }, [onTimeout, onTick, timerValue, locked, hidden, value]);

    return (
        <Progress colorScheme="orange" size="xs" hidden={hidden} value={value} minHeight="0.25rem"/>
    );
}

export default Timer;