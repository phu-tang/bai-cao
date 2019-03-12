import React from 'react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { compose, branch, renderComponent } from 'recompose';
import { isEmptyCards, imageCardsSelector } from './state';

const Layout = ({ reverse = false, player }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      height: '100%',
      flexDirection: reverse ? 'column-reverse' : 'column',
      border: '1px solid black',
    }}
  >
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EnhanceCards player={player} />
    </div>
    <div align="center">{player}</div>
  </div>
);

const CardContent = ({ images }) => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {map(images, (item, index) => (
      <img
        style={{ margin: 5, flex: 1, maxWidth: 150 }}
        src={item}
        alt={'cardImage'}
        key={index}
      />
    ))}
  </div>
);

const EnhanceCards = compose(
  connect((state, { player }) => ({
    isEmptyCards: isEmptyCards(player)(state),
    images: imageCardsSelector(player)(state),
  })),
  branch(
    ({ isEmptyCards }) => isEmptyCards,
    renderComponent(() => <div>Waiting for Cards</div>),
  ),
)(CardContent);

export default compose()(Layout);
