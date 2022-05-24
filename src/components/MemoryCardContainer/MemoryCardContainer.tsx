import React from 'react';
import './memory-card-container.scss';
import Card from '../Card/Card';
import { CardData } from '../../types/memory-game-types';

import { SimpleGrid } from '@chakra-ui/react'

// Potential params:
// width, height, isFlipped, canHover, onClick

function MemoryCardContainer(props: any) {

    const { gameState, onCardClicked } = props;

    return (
        <div className="memory-card-container">
            <SimpleGrid columns={gameState.columns} spacing={16}>
                {gameState.cards.map((card: CardData, i: number) => {
                    return (
                        <Card key= {i} onClick={(e: any) => onCardClicked(card, gameState)} isFlipped={card.isFlipped} icon={card.contents}></Card>
                    )
                })}
            </SimpleGrid>
            
        </div>
    );
}

export default MemoryCardContainer;