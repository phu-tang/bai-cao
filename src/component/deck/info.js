import React from 'react';
import { connect } from 'react-redux';
import { compose, branch, renderComponent } from 'recompose';
import {
  initGameFA,
  currentDeckSelector,
  PLAYER1,
  PLAYER2,
  PLAYER3,
  CURRENT_PLAYER,
  currentStatusSelector,
  scoreSelector,
  currentRoundSelector,
} from './state';
import ActionButton from './actionButton';

const LoadingComponent = branch(
  ({ isFetching }) => isFetching,
  renderComponent(() => <div>Loading....</div>),
);

const NewGame = ({ onClick }) => (
  <div>
    <button onClick={onClick}>New game</button>
  </div>
);

const EnhanceNewGame = compose(
  connect(
    state => ({
      isFetching: initGameFA.isFetchingSelector(state),
    }),
    {
      onClick: initGameFA.actionCreator,
    },
  ),
  LoadingComponent,
)(NewGame);

const RoundContentLayout = ({
  id,
  status,
  player1,
  player2,
  player3,
  currentUser,
  currentRound,
}) => (
  <div>
    <h3>ID: {id}</h3>
    <h4>Round: {currentRound}</h4>
    <p> {status}</p>
    <div>Score:</div>
    <li>PLAYER1: {player1}</li>
    <li>PLAYER2: {player2}</li>
    <li>PLAYER3: {player3}</li>
    <li>CURRENT_PLAYER: {currentUser}</li>
    <ActionButton />
  </div>
);

const EnhanceRoundContentLayout = compose(
  connect(state => ({
    currentRound: currentRoundSelector(state),
    id: currentDeckSelector(state),
    status: currentStatusSelector(state),
    player1: scoreSelector(PLAYER1)(state),
    player2: scoreSelector(PLAYER2)(state),
    player3: scoreSelector(PLAYER3)(state),
    currentUser: scoreSelector(CURRENT_PLAYER)(state),
  })),
)(RoundContentLayout);

export default compose(
  connect(state => ({
    currentDeck: currentDeckSelector(state),
  })),
  branch(({ currentDeck }) => !currentDeck, renderComponent(EnhanceNewGame)),
)(EnhanceRoundContentLayout);
