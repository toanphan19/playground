import React from "react";

export default class Guess extends React.Component {
  render() {
    return (
      <div className="game-guesser-container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <span >Best guesses: {this.props.nextBestGuesses.join(", ")}</span>
        &nbsp;
        <button
          type="button"
          onClick={this.props.onButtonClick}
          className="material-icons-outlined"
        >
          <span className="material-icons" >autorenew</span>
        </button>

      </div >
    );
  }

  getNextBestGuessesStr(nextBestGuesses) {
    console.log(this.props.nextBestGuesses);
    console.log("WOW", this.props.nextBestGuesses.join(", "));
    return this.props.nextBestGuesses.join(", ");
  }
}
