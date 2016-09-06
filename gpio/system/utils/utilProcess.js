

// catches uncaught exceptions
process.on('uncaughtException', function (err) {
  console.error(' ------- ------- ------- ------- uncaughtException  -------> : ');

  console.error('\n' + (new Date).toUTCString() + '\n' +
                ' uncaughtException:', err.message);

  if (err) {
    console.error(err.stack);
  }

  process.exit(1)
});

// catches ctrl+c event and exit normally
process.on('SIGINT', function (err) {
  console.error(' ------- ------- ------- ------- SIGINT  -------> : ');

  console.error('\n' + (new Date).toUTCString() + '\n' +
                ' Ctrl-C...  \n');
  process.stdin.resume();
  if (err) {
    console.error(err.stack);
  }

  process.exit(2)
});


// catches process.emit('warning')
process.on('warning', function (warning) {
//  process.on('warning', (warning) => {
  console.error(' ------- ------- ------- ------- WARNIG  -------> : ');
  console.warn(warning.name);
  console.warn(warning.message);
//  console.warn(warning.stack);
  console.warn(warning.errstk);

/*
  var request = require("request");

  request("http://localhost:3000", function(error, response, body) {
    console.log(body);
  });
*/
/*
  res.render('error', {
    message: warning.message,
    error: warning.errstk
  });
*/
});
