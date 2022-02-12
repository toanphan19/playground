import React from "react";

export default function Wordle() {
  return (
    <div className="container">

      <h1>Wordle Solver</h1>
      <Game />
    </div>
  );
}


const hintEnum = {
  CORRECT: "C",
  INCORRECT: "I",
  NOT_IN_WORD: "N"
}


class Tile extends React.Component {
  render() {
    return (
      <button
        className={"game-tile " + this.hintClass(this.props.hint)}
        onClick={this.changeHint}
      >
        {this.props.letter}
      </button >
    );
  }

  hintClass(hint) {
    let hintClass;
    switch (hint) {
      case hintEnum.CORRECT:
        hintClass = "game-tile-correct";
        break;
      case hintEnum.INCORRECT:
        hintClass = "game-tile-incorrect";
        break;
      case hintEnum.NOT_IN_WORD:
        hintClass = "game-tile-not-in-word";
        break;
      default:
        hintClass = "";
        break;
    }
    return hintClass;
  }

  // changeHint() {
  //   let state = this.state
  //   switch (state.hint) {
  //     case hintEnum.CORRECT:
  //       state.hint = hintEnum.INCORRECT;
  //       state.hintClass = "game-tile-incorrect";
  //       break;
  //     case hintEnum.INCORRECT:
  //       state.hint = hintEnum.NOT_IN_WORD;
  //       state.hintClass = "game-tile-not-in-word";
  //       break;
  //     case hintEnum.NOT_IN_WORD:
  //       state.hint = null;
  //       state.hintClass = "";
  //       break;
  //     default:
  //       state.hint = hintEnum.CORRECT;
  //       state.hintClass = "game-tile-correct";
  //       break;
  //   }
  //   this.setState(state)
  // }


}

class Row extends React.Component {
  render() {
    return (
      <div className="game-row">
        {this.renderTile(0)}
        {this.renderTile(1)}
        {this.renderTile(2)}
        {this.renderTile(3)}
        {this.renderTile(4)}
        {/* <button
          onClick={this.props.clearWord}
        >
          Clear
        </button> */}
      </div >
    );
  }
  renderTile(i) {
    return (
      <Tile
        letter={this.props.word[i]}
        hint={this.props.hints[i]}
      />
    );
  }
}

class Board extends React.Component {
  render() {
    return (
      <div className="game-board">
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
      </div>
    );
  }

  renderRow(i) {
    return <Row
      word={this.props.guesses[i].word}
      hints={this.props.guesses[i].hints}
    />
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guesses: Array(6).fill().map(() => {
        return {
          word: Array(5).fill(" "),
          hints: Array(5).fill(null)
        };
      }),
      currentLetterPos: {
        row: 0,
        col: -1,
      }
    }
  }

  render() {
    return (
      <div className="game-container">
        <Board
          guesses={this.state.guesses}
        />
        <Guess />
        <Keyboard
          onClickKeyboardButton={(key) => this.onClickKeyboardButton(key)}
        />
      </div>
    );
  }

  onClickKeyboardButton(key) {
    console.log(key);
    console.log(this.state);
    switch (key) {
      case "ENTER":
        if (this.state.currentLetterPos.col != 4) {
          break;
        }

        // TODO: Make a guess?
        this.moveKeyboardCursor(this.state.currentLetterPos.row + 1, -1)
        break;
      case "DEL":
        if (this.state.currentLetterPos.col < 0) {
          break;
        }
        this.changeCurrentLetter(null)
        this.moveKeyboardCursor(this.state.currentLetterPos.row, this.state.currentLetterPos.col - 1)
        break;
      default:  // a letter from A-Z
        if (this.state.currentLetterPos.col >= 4) {
          break;
        }

        this.moveKeyboardCursor(this.state.currentLetterPos.row, this.state.currentLetterPos.col + 1);
        this.changeCurrentLetter(key);
        break;
    }
  }

  moveKeyboardCursor(wordIndex, letterIndex) {
    let newState = this.state;
    newState.currentLetterPos.row = wordIndex;
    newState.currentLetterPos.col = letterIndex;
    this.setState(newState);
  }

  changeCurrentLetter(letter) {
    let newState = this.state;
    newState.guesses[this.state.currentLetterPos.row].word[this.state.currentLetterPos.col] = letter;
    this.setState(newState)
  }
}

class Guess extends React.Component {
  render() {
    return (
      <div>
        <span>Best guess: </span> ROBOT
      </div>
    );
  }
}

class Keyboard extends React.Component {
  render() {
    let row3_values = "ZXCVBNM".split("");

    return (
      <div className="keyboard">
        <div className="keyboard-row">
          {"QWERTYUIOP".split("").map((letter) => {
            return this.renderKey(letter);
          })}
        </div>
        <div className="keyboard-row">
          {"ASDFGHJKL".split("").map((letter) => {
            return this.renderKey(letter);
          })}
        </div>
        <div className="keyboard-row">
          {this.renderKey("ENTER")}
          {row3_values.map((letter) => {
            return this.renderKey(letter);
          })}
          {this.renderKey("DEL")}
        </div>
      </div>
    );
  }

  renderKey(key) {
    return <KeyboardButton
      value={key}
      onClickKeyboardButton={() => { this.props.onClickKeyboardButton(key) }}
    />
  }

}

class KeyboardButton extends React.Component {
  getClassName(key) {
    if (["ENTER", "DEL"].includes(key)) {
      return "keyboard-button keyboard-button-three-halves"
    } else {
      return "keyboard-button"
    }
  }

  render() {
    return <button
      className={this.getClassName(this.props.value)}
      value={this.props.value}
      onClick={this.props.onClickKeyboardButton}
    >
      {this.props.value}
    </button>
  }
}
