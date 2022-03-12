import React from "react";
import { hintEnum } from "./common";


export default class Board extends React.Component {
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