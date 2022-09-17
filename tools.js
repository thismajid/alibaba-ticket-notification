const readline = require("readline-sync");
const chalk = require("chalk");

exports.getInput = (text, color) => {
  switch (color) {
    case "red":
      return readline.question(chalk.red(text));
    case "blue":
      return readline.question(chalk.blue(text));
  }
};

exports.logger = (text, color) => {
  if (typeof text === "object") text = JSON.stringify(text);
  switch (color) {
    case "red":
      return console.log(chalk.red(text));
    case "green":
      return console.log(chalk.green(text));
    case "blue":
      return console.log(chalk.blue(text));
    case "yellow":
      return console.log(chalk.yellow(text));
  }
};
