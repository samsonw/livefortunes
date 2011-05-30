process.addListener('uncaughtException', function(err, stack) {
  console.log('------------------------------');
  console.log('Exception: ' + err);
  console.log(err.stack);
  console.log('------------------------------');
});

var LiveFortunes = require('./lib/livefortunes');

new LiveFortunes({
  port: 8000,
  refresh_interval: 120
});
