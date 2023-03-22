

export const Decks = [
    { deckName: "fibonacci", cards: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "Pass"] },
    { deckName: "tshirts", cards: ["xxs", "xs", "s", "m", "l", "xl", "xxl", "?", "Pass"] },
    { deckName: "powersOfTwo", cards: ["0", "1", "2", "4", "8", "16", "32", "64", "?", "Pass"] }
]

import { GameType } from '../../../types/game';

export interface CardConfig {
    value: number;
    displayValue: string;
    color: string;
}
export const fibonacciCards: CardConfig[] = [
    { value: 0, displayValue: '0', color: '#e7edf3' },
    { value: 1, displayValue: '1', color: '#9EC8FE' },
    { value: 2, displayValue: '2', color: '#9EC8FE' },
    { value: 3, displayValue: '3', color: '#A3DFF2' },
    { value: 5, displayValue: '5', color: '#A3DFF2' },
    { value: 8, displayValue: '8', color: '#9DD49A' },
    { value: 13, displayValue: '13', color: '#9DD49A' },
    { value: 21, displayValue: '21', color: '#F4DD94' },
    { value: 34, displayValue: '34', color: '#F4DD94' },
    { value: 55, displayValue: '55', color: '#F39893' },
    { value: 89, displayValue: '89', color: '#F39893' },
    { value: -2, displayValue: '❓', color: '#e7edf3' },
    { value: -1, displayValue: 'Pass', color: '#e7edf3' },
];

export const powersOfTwoCards: CardConfig[] = [
    { value: 0, displayValue: '0', color: '#e7edf3' },
    { value: 0.5, displayValue: '½', color: '#9EC8FE' },
    { value: 2, displayValue: '2', color: '#9EC8FE' },
    { value: 3, displayValue: '3', color: '#A3DFF2' },
    { value: 5, displayValue: '5', color: '#A3DFF2' },
    { value: 8, displayValue: '8', color: '#9DD49A' },
    { value: 13, displayValue: '13', color: '#9DD49A' },
    { value: 21, displayValue: '20', color: '#F4DD94' },
    { value: 34, displayValue: '40', color: '#F4DD94' },
    { value: 55, displayValue: '100', color: '#F39893' },
    { value: -2, displayValue: '❓', color: '#e7edf3' },
    { value: -1, displayValue: 'Pass', color: '#e7edf3' },
];

export const tShirtCards: CardConfig[] = [
    { value: 10, displayValue: 'XXS', color: '#e7edf3' },
    { value: 20, displayValue: 'XS', color: '#9EC8FE' },
    { value: 30, displayValue: 'S', color: '#9EC8FE' },
    { value: 40, displayValue: 'M', color: '#A3DFF2' },
    { value: 50, displayValue: 'L', color: '#A3DFF2' },
    { value: 60, displayValue: 'XL', color: '#9DD49A' },
    { value: 70, displayValue: 'XXL', color: '#9DD49A' },
    { value: -2, displayValue: '❓', color: '#e7edf3' },
    { value: -1, displayValue: 'Pass', color: '#e7edf3' },
];

export const getCards = (gameType: GameType | undefined): CardConfig[] => {
    switch (gameType) {
        case GameType.Fibonacci:
            return fibonacciCards;
        case GameType.PowersOfTwo:
            return powersOfTwoCards;
        case GameType.TShirt:
            return tShirtCards;
        default:
            return fibonacciCards;
    }
};
