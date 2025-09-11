module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', // for Expo projects
      '@babel/preset-env', // transpile ES6+ for Node/Jest
    ],
  };
};
