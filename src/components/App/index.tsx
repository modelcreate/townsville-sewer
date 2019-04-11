import React, { Component } from 'react';
import './index.css';
import Deck from '../Deck'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Deck loopLength={13014124} animationSpeed={1} />
      </div>
    );
  }
}

export default App;
