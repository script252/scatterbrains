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
        cards: newCards,
        selected: [],
        matched: []
    }

    return initialGameState;
}

export function clickedCard(card: CardData, state: GameState): GameState {

    const selectedCards = getSelectedCards(state.selected, card);

    //const modifiedCard = {
    //    ...card,
    //    isFlipped: selectedCards.some(sel => sel.id === card.id)//!card.isFlipped
    //}

    //const newCards = state.cards.map(c => c.id === card.id ? modifiedCard : c);

    const newState = {
        ...state,
        //cards: newCards,
        selected: selectedCards
    }

    return newState;
}

function getSelectedCards(currentSelected: CardData[], newSelected: CardData): CardData[] {

    // Determine what card(s) should be selected/locked

    if(currentSelected.some((sel: CardData) => sel.id === newSelected.id)) {

        // Allow clearing selection if there's 2
        if(currentSelected.length === 2)
            return [];

        return currentSelected;
    }
        

    if(currentSelected.length >= 2)
        return [];

    if(currentSelected.length === 0)
        return [newSelected];

    if(currentSelected.length === 1)
        return [currentSelected[0], newSelected];

    return [...currentSelected];
}