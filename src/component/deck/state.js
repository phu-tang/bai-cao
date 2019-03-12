import { handleActions } from 'redux-actions';
import {
  always,
  path,
  size,
  includes,
  flow,
  isEmpty,
  toNumber,
  map,
  filter,
  sum,
  max,
  pickBy,
  keys,
  join,
} from 'lodash/fp';
import { combineReducers } from 'redux';
import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { createSelector } from 'reselect';

export const PLAYER1 = 'PLAYER1';
export const PLAYER2 = 'PLAYER2';
export const PLAYER3 = 'PLAYER3';
export const CURRENT_PLAYER = 'you';

export const TOTAL_ROUND = 5;
const BET_VALUE = 5000;

const INIT_ROUND_ACTION = 'INIT_ROUND_ACTION';
const REVEAL_ACTION = 'REVEAL_ACTION';
const WIN_ROUND_ACTION = 'WIN_ROUND_ACTION';
const TOGGLE_DIALOG_ACTION = 'TOGGLE_DIALOG_ACTION';

const THREE_KING_VALUE = 31;

const DEFAULT_PLAY_CARD =
  'https://product.hstatic.net/1000273792/product/2_7b8007e29a664c6eb0a213165dd70f68_master.jpg';

const is3King = cards =>
  flow(
    map('value'),
    filter(item => item === 'JACK' || item === 'KING' || item === 'QUEEN'),
    item => size(item) === 3,
  )(cards);

const cardValue = value => {
  if (value === 'JACK') return 10;
  if (value === 'ACE') return 1;
  if (value === 'KING') return 10;
  if (value === 'QUEEN') return 10;
  return toNumber(value);
};

const playerCardValue = cards => {
  if (is3King(cards)) {
    return THREE_KING_VALUE;
  }
  return flow(
    map(item => cardValue(item.value)),
    sum,
    item => item % 10,
  )(cards);
};
export const openDialogAC = always({
  type: TOGGLE_DIALOG_ACTION,
  payload: true,
});
export const closeDialogAC = always({
  type: TOGGLE_DIALOG_ACTION,
  payload: false,
});
export const initRoundAC = always({ type: INIT_ROUND_ACTION });
export const revealAC = always({ type: REVEAL_ACTION });
export const winAC = (winner = []) => ({
  type: WIN_ROUND_ACTION,
  payload: winner,
});
export const scoreSelector = player => path(`deck.playerScores.${player}`);

export const initGameFA = makeFetchAction('initGame', () => ({
  endpoint: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
}));

export const reshuffleFA = makeFetchAction('reshuffle', () => ({
  endpoint: state =>
    `https://deckofcardsapi.com/api/deck/${currentDeckSelector(
      state,
    )}/shuffle/`,
}));

export const drawFA = makeFetchAction('draw', ({ playerName }) => ({
  endpoint: state =>
    `https://deckofcardsapi.com/api/deck/${currentDeckSelector(
      state,
    )}/draw/?count=3`,
  player: playerName,
}));

export const currentDeckSelector = flow(
  initGameFA.dataSelector,
  path('deck_id'),
);

export const isRevealSelector = path('deck.reveal');
export const currentRoundSelector = path('deck.currentRound');

export const canHaveNewRoundSelector = state =>
  currentRoundSelector(state) < TOTAL_ROUND;

export const isFinishDrawingSelector = state =>
  flow(
    path(`deck.cards.${PLAYER1}`),
    item => !isEmpty(item),
  )(state) &&
  flow(
    path(`deck.cards.${PLAYER2}`),
    item => !isEmpty(item),
  )(state) &&
  flow(
    path(`deck.cards.${PLAYER3}`),
    item => !isEmpty(item),
  )(state) &&
  flow(
    path(`deck.cards.${CURRENT_PLAYER}`),
    item => !isEmpty(item),
  )(state);

const winValueSelector = flow(
  path('deck.cards'),
  map(item => playerCardValue(item)),
  max,
);

const displayWinValue = flow(
  winValueSelector,
  item => (item === THREE_KING_VALUE ? ' Three king' : item),
);

export const currentStatusSelector = state => {
  if (reshuffleFA.isFetchingSelector(state)) {
    return 'Reshuffling';
  }
  if (!reshuffleFA.dataSelector(state)) {
    return 'Ready to reshuffle';
  }
  if (drawFA.isFetchingSelector(state)) {
    return 'Drawing';
  }
  if (!isFinishDrawingSelector(state)) {
    return 'Ready to Draw';
  }
  if (!isRevealSelector(state)) {
    return 'Ready to reveal';
  }
  if (isRevealSelector(state)) {
    const winner = winnerSelector(state);
    const winValue = displayWinValue(state);
    return `Win: ${winValue} point - Winner is ${join(',', winner)}`;
  }
};

export const winnerSelector = state => {
  const winValue = winValueSelector(state);
  const value = flow(
    path('deck.cards'),
    pickBy(item => playerCardValue(item) === winValue),
    keys,
  )(state);
  return value;
};

export const isEmptyCards = playerName =>
  flow(
    path(`deck.cards.${playerName}`),
    item => size(item) === 0,
  );

export const imageCardsSelector = playerName =>
  createSelector(
    path(`deck.cards.${playerName}`),
    isRevealSelector,
    (cards, isReveal) => {
      if (playerName === CURRENT_PLAYER || isReveal) {
        return map('image', cards);
      }
      return [DEFAULT_PLAY_CARD, DEFAULT_PLAY_CARD, DEFAULT_PLAY_CARD];
    },
  );

export const currentValueSelector = flow(
  path(`deck.cards.${CURRENT_PLAYER}`),
  playerCardValue,
  item => (item === THREE_KING_VALUE ? ' Three king' : item),
);

export const isOpenDialogSelector = path('deck.isOpenDialog');

export const winnerMessageSelector = state => {
  const maxValue = flow(
    path('deck.playerScores'),
    map(item => item),
    max,
  )(state);
  const winners = flow(
    path('deck.playerScores'),
    pickBy(item => item === maxValue),
    keys,
  )(state);
  return `${join(',', winners)} win the game with ${maxValue} scores`;
};

const playerScoreReducer = handleActions(
  {
    [ACTIONS.COMPLETE]: (state, { payload }) => {
      if (path('name', payload) === 'initGame') {
        return {
          [PLAYER1]: TOTAL_ROUND * BET_VALUE,
          [PLAYER2]: TOTAL_ROUND * BET_VALUE,
          [PLAYER3]: TOTAL_ROUND * BET_VALUE,
          [CURRENT_PLAYER]: TOTAL_ROUND * BET_VALUE,
        };
      }
      return state;
    },
    [INIT_ROUND_ACTION]: state => ({
      [PLAYER1]: path(PLAYER1, state) - BET_VALUE,
      [PLAYER2]: path(PLAYER2, state) - BET_VALUE,
      [PLAYER3]: path(PLAYER3, state) - BET_VALUE,
      [CURRENT_PLAYER]: path(CURRENT_PLAYER, state) - BET_VALUE,
    }),
    [WIN_ROUND_ACTION]: (state, { payload }) => {
      const eachWinValue = (BET_VALUE * 4) / size(payload);
      return {
        [PLAYER1]: includes(PLAYER1, payload)
          ? path(PLAYER1, state) + eachWinValue
          : path(PLAYER1, state),
        [PLAYER2]: includes(PLAYER2, payload)
          ? path(PLAYER2, state) + eachWinValue
          : path(PLAYER2, state),
        [PLAYER3]: includes(PLAYER3, payload)
          ? path(PLAYER3, state) + eachWinValue
          : path(PLAYER3, state),
        [CURRENT_PLAYER]: includes(CURRENT_PLAYER, payload)
          ? path(CURRENT_PLAYER, state) + eachWinValue
          : path(CURRENT_PLAYER, state),
      };
    },
  },
  {},
);

const currentRoundReducer = handleActions(
  {
    [INIT_ROUND_ACTION]: state => state + 1,
    [ACTIONS.COMPLETE]: (state, { payload }) => {
      if (path('name', payload) === 'initGame') {
        return 1;
      }
      return state;
    },
  },
  0,
);

const revealReducer = handleActions(
  {
    [INIT_ROUND_ACTION]: always(false),
    [ACTIONS.COMPLETE]: (state, { payload }) => {
      if (path('name', payload) === 'initGame') {
        return false;
      }
      return state;
    },
    [REVEAL_ACTION]: always(true),
  },
  false,
);

const cardsReducer = handleActions(
  {
    [INIT_ROUND_ACTION]: always({}),
    [ACTIONS.COMPLETE]: (state, { payload }) => {
      if (path('name', payload) === 'draw') {
        const player = path('player', payload);
        const cards = path('json.cards', payload);
        return {
          ...state,
          [player]: cards,
        };
      }
      if (path('name', payload) === 'initGame') {
        return {};
      }
      return state;
    },
  },
  {},
);

const isOpenDialogReducer = handleActions(
  { [TOGGLE_DIALOG_ACTION]: (state, { payload }) => payload },
  false,
);

const reducer = combineReducers({
  currentRound: currentRoundReducer,
  playerScores: playerScoreReducer,
  reveal: revealReducer,
  cards: cardsReducer,
  isOpenDialog: isOpenDialogReducer,
});

export default {
  deck: reducer,
};
