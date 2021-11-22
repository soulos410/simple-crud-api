const {getCorrectArgs} = require("./getCorrectArgs");

const initializeProcessEnv = () => {
  const correctArgs = getCorrectArgs();

  process.env = correctArgs.reduce((acc, el, index) => {
    if (index % 2 === 0) {
      const argValue = correctArgs[index + 1].split("=");

      acc[argValue[0]] = argValue[1];
    }

    return acc;
  }, {});
};

module.exports = { initializeProcessEnv };
