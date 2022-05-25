export interface CardData {
    id: number;
    isFlipped: boolean;
    contents: any;
}

export interface GameState {
    columns: number;
    cards: CardData[];

    selected: CardData[];
    matched: CardData[];
}