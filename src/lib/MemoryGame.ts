import { CardData } from '../components/Card/Card';
import { GameState } from '../types/memory-game-types';

import { getUniqueIcons } from './memoryGameData';

// Max size should be 32x32 maybe

export function init(rows: number, columns: number): GameState {
    console.log('Generating memory game', rows * columns);

    const cardIcons = getUniqueIcons((rows * columns) / 2);

    // Generate cards
    const newCards = new Array<CardData>(rows * columns)
        .fill({id: 0, isFlipped: false, contents: ''})
        .map((c: CardData, i: number) => {
            return {
                id: i,
                isFlipped: false,
                contents: cardIcons[i]
            }
        });

    const initialGameState: GameState = {
        columns: columns,
        cards: newCards
    }

    return initialGameState;
}

export function clickedCard(card: CardData, state: GameState): GameState {

    const modifiedCard = {
        ...card,
        isFlipped: !card.isFlipped
    }

    const newCards = state.cards.map(c => c.id === card.id ? modifiedCard : c);

    const newState = {
        ...state,
        cards: newCards
    }

    return {...newState};
}