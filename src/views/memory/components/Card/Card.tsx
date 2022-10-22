import React from 'react';
import './card.scss';

import { Box, Icon } from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md';

export interface CardData {
    id: number;
    isFlipped: boolean;
    contents: any;  // IconType; 
}

// Potential params:
// width, height, isFlipped, canHover, onClick

function Card(props: any) {

    const { onClick, isFlipped, isMatched, icon } = props;

    const getStyles = () => {
        return (isFlipped===true ? " flipped" : "") + (isMatched===true ? " flipped matched" : "");
    }

    return (
        <Box className={ "flip-card-container" + getStyles() } onClick={onClick} h={["40px", "48px", "64px"]} w={["40px", "48px", "64px"]}>
            <div className="flip-card hover-card">
                <div className="card-front">
                    <div className="card-content">
                        <Icon as={MdSettings} className="icon" width="100%" height="100%"></Icon>
                    </div>
                </div>
                <div className="card-back">
                    <div className="card-content">
                        <Icon as={icon} height="100%" width="100%"></Icon>
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default Card;