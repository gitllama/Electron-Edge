if (process.argv.indexOf('-H') > 0) {
  console.log(`
    Help
      -H : Help
  `);
} else {
  require('babel-register');
  require('./main/main');
}
