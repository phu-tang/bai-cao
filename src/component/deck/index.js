import React from 'react';
import Info from './info';
import Player from './player';
import { PLAYER1, PLAYER2, PLAYER3, CURRENT_PLAYER } from './state';
import Dialog from './dialog';

export default () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
    }}
  >
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ flex: 1 }} />
      <div style={{ flex: 1, height: '100%' }}>
        <Player reverse player={PLAYER1} />
      </div>
      <div style={{ flex: 1 }} />
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
        }}
      >
        <Player player={PLAYER3} />
      </div>
      <div
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Info />
      </div>
      <div style={{ flex: 1, height: '100%' }}>
        <Player player={PLAYER2} />
      </div>
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ flex: 1 }} />
      <div style={{ flex: 1, height: '100%' }}>
        <Player player={CURRENT_PLAYER} />
      </div>
      <div style={{ flex: 1 }} />
    </div>
    <Dialog />
  </div>
);
