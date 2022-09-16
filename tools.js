const chalk = require("chalk");

exports.logger = (text, color) => {
  switch (color) {
    case "red":
      return console.log(chalk.red(text));
    case "green":
      return console.log(chalk.green(text));
    case "blue":
      return console.log(chalk.blue(text));
  }
};
