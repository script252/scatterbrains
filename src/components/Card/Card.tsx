import React from 'react';
import './card.scss';

import { Icon } from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md';

export interface CardData {
    id: number;
    isFlipped: boolean;
    contents: any;  // IconType; 
}

// Potential params:
// width, height, isFlipped, canHover, onClick

function Card(props: any) {

    const { onClick, isFlipped, icon } = props;

    return (
        <div className={"flip-card-container" + (isFlipped===true ? " flipped" : "") } onClick={onClick}>
            <div className="flip-card hover-card">
                <div className="card-front">
                    <div className="card-content">
                        <Icon as={MdSettings} className="icon" width="32px" height="32px"></Icon>
                    </div>
                </div>
                <div className="card-back">
                    <div className="card-content">
                        <Icon as={icon}></Icon>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;