import React from "react";
// import { hintEnum } from "./common";

export default class Keyboard extends React.Component {
  render() {
    let row3_values = "ZXCVBNM".split("");

    return (
      <div className="keyboard" onKeyPress={this.handleKeyPress}>
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
