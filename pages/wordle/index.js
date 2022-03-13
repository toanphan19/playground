import React from "react";

// import { hintEnum } from "./common";
import Board from "./gameboard";
import Keyboard from "./gamekeyboard";
import Guesser from "./guesser";

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
      },
      nextBestGuesses: ["crane"],
    }
  }

  render() {
    return (
      <div className="game-container"
        onKeyDown={(event) => this.handleKeyDown(event)}
      >
        <Board
          guesses={this.state.guesses}
          onTileClick={(row, col) => this.handleTileClick(row, col)}
        />
        <Guesser
          nextBestGuesses={this.state.nextBestGuesses}
        />
        <button
          type="button"
          onClick={() => this.handleNewGuessClick()}
        >  Find next best Guesses</button>
        <Keyboard
          onClickKeyboardButton={(key) => this.onClickKeyboardButton(key)}
        />
      </div>
    );
  }

  handleKeyDown(event) {
    console.log("Pressed key " + event.key);
    event.preventDefault()

    // If alphabet keys:
    if ("abcdefghijklmnopqrstuvwxyz".includes(event.key)) {
      this.onClickKeyboardButton(event.key);
    }
    // Handle special keys:
    switch (event.key) {
      case "Enter":
        this.onClickKeyboardButton("ENTER");
        break;
      case "Backspace":
        this.onClickKeyboardButton("DEL");
        break;
    }
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

  async handleNewGuessClick() {
    let possibleWordles = await getPossibleWordles(this.state.guesses);
    console.log(possibleWordles);
    this.setState({
      nextBestGuesses: possibleWordles.slice(0, 5),
    });
  }

  onClickKeyboardButton(key) {
    key = key.toUpperCase();
    console.log(key);
    console.log(this.state);
    switch (key) {
      case "ENTER":
        if (this.state.currentLetterPos.col <= 4) {
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


function changeHint(hint) {
  switch (hint) {
    case hintEnum.NOT_IN_WORD:
      return hintEnum.INCORRECT;
    case hintEnum.INCORRECT:
      return hintEnum.CORRECT;
    case hintEnum.CORRECT:
      return hintEnum.NOT_IN_WORD
    default:
      return hintEnum.NOT_IN_WORD;
  }
}


function getPossibleWordles(guesses) {
  console.log("Guesses", guesses);

  // Remove not-inputted guesses:

  let requestBody = {
    guesses: guesses.map(guess => {
      return {
        word: guess.word.join(""),
        hints: guess.hints.join(""),
      };
    })
      .filter(guess => guess.word.length === 5)
  }

  let possibleWordles = fetch("https://api.playground.toanphan.dev/wordle/solver", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
  })
    .then(response => response.json())
    .then(data => {
      console.log("ResponseBody:", data);
      let possibleWordleWithScores = data.possible_wordles;
      let possibleWordles = possibleWordleWithScores.map(x => x.word);
      return possibleWordles;
    }).catch(err => {
      console.error("Error: ", err);
    });

  return possibleWordles;
}