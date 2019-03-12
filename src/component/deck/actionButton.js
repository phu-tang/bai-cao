import React from 'react';
import { connect } from 'react-redux';
import { compose, branch, renderComponent, mapProps } from 'recompose';

import {
  initGameFA,
  PLAYER1,
  PLAYER2,
  PLAYER3,
  CURRENT_PLAYER,
  reshuffleFA,
  drawFA,
  isFinishDrawingSelector,
  isRevealSelector,
  revealAC,
  winnerSelector,
  winAC,
  canHaveNewRoundSelector,
  initRoundAC,
} from './state';

const Layout = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

const LoadingComponent = branch(
  ({ isFetching }) => isFetching,
  renderComponent(() => <div>Loading....</div>),
);

const ReshuffleButton = compose(
  connect(
    () => ({ label: 'Reshuffle' }),
    { onClick: reshuffleFA.actionCreator },
  ),
)(Layout);

const DrawButton = compose(
  connect(
    () => ({ label: 'Draw' }),
    dispatch => ({
      onClick: () => {
        dispatch(drawFA.actionCreator({ playerName: PLAYER1 }));
        dispatch(drawFA.actionCreator({ playerName: PLAYER2 }));
        dispatch(drawFA.actionCreator({ playerName: PLAYER3 }));
        dispatch(drawFA.actionCreator({ playerName: CURRENT_PLAYER }));
      },
    }),
  ),
)(Layout);

const RevealButton = compose(
  connect(
    state => ({ winners: winnerSelector(state) }),
    { reveal: revealAC, addWinner: winAC },
  ),
  mapProps(({ reveal, addWinner, winners, ...others }) => ({
    ...others,
    label: 'Reveal',
    onClick: () => {
      reveal();
      addWinner(winners);
    },
  })),
)(Layout);

const NewRoundButton = compose(
  connect(
    () => ({ label: 'New round' }),
    dispatch => ({
      onClick: () => {
        dispatch(reshuffleFA.updater(null));
        dispatch(initRoundAC());
      },
    }),
  ),
)(Layout);

const NewGameButton = compose(
  connect(
    () => ({ label: 'New game' }),
    { onClick: initGameFA.actionCreator },
  ),
)(Layout);

export default compose(
  connect(state => ({
    isFetching:
      reshuffleFA.isFetchingSelector(state) || drawFA.isFetchingSelector(state),
    reshuffleData: reshuffleFA.dataSelector(state),
    isFinishDrawing: isFinishDrawingSelector(state),
    isReveal: isRevealSelector(state),
    canHaveNewRound: canHaveNewRoundSelector(state),
  })),
  LoadingComponent,
  branch(
    ({ reshuffleData }) => !reshuffleData,
    renderComponent(ReshuffleButton),
  ),
  branch(
    ({ isFinishDrawing }) => !isFinishDrawing,
    renderComponent(DrawButton),
  ),
  branch(({ isReveal }) => !isReveal, renderComponent(RevealButton)),
  branch(
    ({ canHaveNewRound }) => canHaveNewRound,
    renderComponent(NewRoundButton),
  ),
)(NewGameButton);
