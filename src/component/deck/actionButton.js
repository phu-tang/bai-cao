import React from 'react';
import { connect } from 'react-redux';
import { compose, branch, renderComponent, mapProps } from 'recompose';
import { Button } from '@material-ui/core';
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
  currentRoundSelector,
  TOTAL_ROUND,
  openDialogAC,
} from './state';

const Layout = ({ label, onClick }) => (
  <Button onClick={onClick}>{label}</Button>
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
    state => ({
      winners: winnerSelector(state),
      currentRound: currentRoundSelector(state),
    }),
    { reveal: revealAC, addWinner: winAC, openDialog: openDialogAC },
  ),
  mapProps(
    ({ reveal, addWinner, winners, currentRound, openDialog, ...others }) => ({
      ...others,
      label: 'Reveal',
      onClick: () => {
        reveal();
        addWinner(winners);
        if (currentRound === TOTAL_ROUND) {
          openDialog();
        }
      },
    }),
  ),
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
