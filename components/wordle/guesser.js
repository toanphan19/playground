import React from "react";

export default class Guess extends React.Component {
  render() {
    return (
      <div>
        <span>Best guess: </span> {this.props.nextBestGuesses.join(", ")}
      </div>
    );
  }

  getNextBestGuessesStr(nextBestGuesses) {
    console.log(this.props.nextBestGuesses);
    console.log("WOW", this.props.nextBestGuesses.join(", "));
    return this.props.nextBestGuesses.join(", ");
  }
}
