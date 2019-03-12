import React from 'react';
import Info from './info';

export default () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'green',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
    }}
  >
    <div style={{ flex: 1, background: 'red' }} />
    <div
      style={{
        flex: 1,
        background: 'blue',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ flex: 1, height: '100%', background: 'green' }} />
      <div style={{ flex: 1, height: '100%' }}>
        <Info />
      </div>
      <div style={{ flex: 1, height: '100%', background: 'orange' }} />
    </div>
    <div style={{ flex: 1, background: 'yellow' }} />
  </div>
);
