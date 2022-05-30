import { CardData } from '../types/memory-game-types';
import { GameState } from '../types/memory-game-types';

import { getUniqueIcons } from './memoryGameData';

// Max size should be 32x32 maybe

export function init(rows: number, columns: number): GameState {
    console.log('Generating memory game', rows * columns);

    const cardIcons = getUniqueIcons((rows * columns) / 2);

    // Generate cards
    const newCards = new Array<CardData>(rows * columns)
        .fill({id: 0, isFlipped: false, isMatched: false, contents: ''})
        .map((c: CardData, i: number) => {
            return {
                id: i,
                isFlipped: false,
                isMatched: false,
                contents: cardIcons[i]
            }
        });

    const initialGameState: GameState = {
        rows: rows,
        columns: columns,
        cards: newCards,
        selected: [],
        matched: [],
        turns: 0,
        showVictory: false
    }

    return initialGameState;
}

export function clickedCard(card: CardData, state: GameState): GameState {

    const selectedCards = getSelectedCards(state.selected, card, state);
    const matchingCards = getMatchingCards(selectedCards, state.matched);

    // If there was a match, set selection to empty so we don't have to do a no-action click
    //const selectedUnlessMatch = matchingCards.length > state.matched.length ? [] : selectedCards;

    const newState = {
        ...state,
        selected: selectedCards,
        matched: matchingCards,
        turns: state.turns + (selectedCards.length === 1 ? 1 : 0),
        showVictory: matchingCards.length === state.cards.length
    }

    return newState;
}

function getSelectedCards(currentSelected: CardData[], newSelected: CardData, state: GameState): CardData[] {

    // Determine what card(s) should be selected/locked

    if(state.matched.some((match: CardData) => match.id === newSelected.id))
        return currentSelected;

    if(currentSelected.some((sel: CardData) => sel.id === newSelected.id)) {

        // Allow clearing selection if there's 2
        if(currentSelected.length === 2)
            return [newSelected];

        return currentSelected;
    }

    if(currentSelected.length >= 2)
        return [newSelected];

    if(currentSelected.length === 0)
        return [newSelected];

    if(currentSelected.length === 1)
        return [currentSelected[0], newSelected];

    return [...currentSelected];
}

function getMatchingCards(currentSelected: CardData[], currentMatches: CardData[]): CardData[] {
    
    if(currentSelected.length === 2) {
        if(currentSelected[0].contents === currentSelected[1].contents)
            return [...currentMatches, ...currentSelected];
    }

    return currentMatches;
}