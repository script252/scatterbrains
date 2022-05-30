export interface CardData {
    id: number;
    isFlipped: boolean;
    isMatched: boolean;
    contents: any;
}

export interface GameState {
    rows: number;
    columns: number;
    cards: CardData[];

    selected: CardData[];
    matched: CardData[];

    turns: number;
    showVictory: boolean;
}