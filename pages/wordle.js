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
        className={"game-tile " + this.getHintClass(this.props.hint)}
        onClick={this.props.onClick}
      >
        {this.props.letter}
      </button >
    );
  }

  getHintClass(hint) {
    let hintClass;
    switch (hint) {
      case hintEnum.CORRECT:
        hintClass = "game-color-correct";
        break;
      case hintEnum.INCORRECT:
        hintClass = "game-color-incorrect";
        break;
      case hintEnum.NOT_IN_WORD:
        hintClass = "game-color-not-in-word";
        break;
      default:
        hintClass = "";
        break;
    }
    return hintClass;
  }
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
        onClick={() => this.props.onTileClick(i)}
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

  renderRow(row_i) {
    return <Row
      word={this.props.guesses[row_i].word}
      hints={this.props.guesses[row_i].hints}
      onTileClick={(col_i) => this.props.onTileClick(row_i, col_i)}
    />
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guesses: Array(6).fill().map(() => {
        return {
          word: Array(5).fill(null),
          hints: Array(5).fill(null)
        };
      }),
      currentLetterPos: {
        row: 0,
        col: 0,
      }
    }
  }

  render() {
    return (
      <div className="game-container">
        <Board
          guesses={this.state.guesses}
          onTileClick={(row, col) => this.handleTileClick(row, col)}
        />
        <Guess />
        <Keyboard
          onClickKeyboardButton={(key) => this.onClickKeyboardButton(key)}
        />
      </div>
    );
  }

  handleTileClick(row, col) {
    console.log(this.state);
    console.log(row, col)

    let newState = this.state;
    let currentHint = newState.guesses[row].hints[col];
    let newHint = changeHint(currentHint);
    newState.guesses[row].hints[col] = newHint;
    this.setState(newState);

    console.log("New state guesses:", newState.guesses)
  }

  onClickKeyboardButton(key) {
    console.log(key);
    console.log(this.state);
    switch (key) {
      case "ENTER":
        if (this.state.currentLetterPos.col < 4) {
          break;
        }
        // TODO: Make a guess?
        this.moveKeyboardCursorForward();
        break;
      case "DEL":
        this.moveKeyboardCursorBack();
        this.changeCurrentLetter(null);
        this.changeCurrentHint(null);
        break;
      default:  // a letter from A-Z
        if (this.state.currentLetterPos.col > 4) {
          break;
        }

        this.changeCurrentLetter(key);
        this.changeCurrentHint(hintEnum.NOT_IN_WORD);
        this.moveKeyboardCursor(this.state.currentLetterPos.row, this.state.currentLetterPos.col + 1);
        break;
    }
  }

  moveKeyboardCursorForward() {
    if (this.isLastTile(this.state.currentLetterPos.row, this.state.currentLetterPos.col)) {
      return;
    }
    if (this.state.currentLetterPos.col >= 4) {
      this.moveKeyboardCursor(this.state.currentLetterPos.row + 1, 0);
    } else {
      this.moveKeyboardCursor(this.state.currentLetterPos.row,
        this.state.currentLetterPos.col + 1);
    }
  }

  isLastTile(row, col) {
    return row == 5 && col == 4;
  }

  moveKeyboardCursor(row, col) {
    let newState = this.state;
    newState.currentLetterPos.row = row;
    newState.currentLetterPos.col = col;
    this.setState(newState);
  }

  moveKeyboardCursorBack() {
    if (this.isFirstTile(this.state.currentLetterPos.row, this.state.currentLetterPos.col)) {
      return;
    }
    if (this.state.currentLetterPos.col == 0) {
      this.moveKeyboardCursor(this.state.currentLetterPos.row - 1, 4);
    } else {
      this.moveKeyboardCursor(this.state.currentLetterPos.row, this.state.currentLetterPos.col - 1);
    }
  }

  isFirstTile(row, col) {
    return row == 0 && col == 0;
  }

  changeCurrentLetter(letter) {
    let newState = this.state;
    newState.guesses[this.state.currentLetterPos.row].word[this.state.currentLetterPos.col] = letter;
    this.setState(newState)
  }

  changeCurrentHint(hintClass) {
    let newState = this.state;
    newState.guesses[this.state.currentLetterPos.row].hints[this.state.currentLetterPos.col] = hintClass;
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


function changeHint(hint) {
  switch (hint) {
    case hintEnum.CORRECT:
      return hintEnum.INCORRECT
      break;
    case hintEnum.INCORRECT:
      return hintEnum.NOT_IN_WORD;
      break;
    case hintEnum.NOT_IN_WORD:
      return hintEnum.CORRECT;
      break;
    default:
      return hintEnum.NOT_IN_WORD;
      break;
  }
}
