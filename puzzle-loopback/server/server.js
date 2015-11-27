var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var env = require('get-env')({
  test: 'test'
});

var app = module.exports = loopback();
var staticPath = null;

if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '../client/app/');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../dist/');
  console.log("Running app in prodction mode");
}


app.use(loopback.static(staticPath));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //Comment this app.start line and add following lines
    //app.start();
    var io  = require('socket.io').listen(app.start());

    io.set('transports', [
        'websocket'
      , 'polling'
    ]);

    console.log("socket init");
    io.sockets.on('connection', function (socket) {
      socket.send('Hello');
      socket.on('message', function(msg) {
        console.log("Client say [" + msg + "]");
      });
      /*socket.emit('ServerEvent', {name : 'Jerry'});
      socket.on('ClientEventEmpty', function () {
        console.log('ClientEventEmpty');
      });
      socket.on('ClientEventData', function (data) {
        console.log('ClientEventData [' + data.myData + ']');
      });
      socket.on('ClientEventCallback', function (fn) {
        console.log('ClientEventCallback');
        fn('Done');
      });
      socket.on('Ping', function (data) {
        console.log('Ping packet ' + data);
        socket.emit('Pong', data);
      });*/
      socket.emit('Pong', "hola oscar");
    });
    console.log("chat init");
    var chat = io
      .of('/chat')
      .on('connection', function(socket) {
      socket.on('message', function (msg) {
        console.log('New message to chat [' + msg + ']');
      });
      socket.send('hi from chat');
    });
  }
});

