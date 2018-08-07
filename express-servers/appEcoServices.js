var express  = require('express');
var http = require('http');
var logger = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var app = express();

app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({                                 // parse application/x-www-form-urlencoded
   parameterLimit: 100000,                // bigger parameter sizes
   limit: '5mb',                          // bigger parameter sizes
   extended: false
 }));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});

//app.listen(10000);

var server = http.createServer(app);

server.listen(10000 || process.env.PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('Eco services RPC server is up')
})

app.get('/', (req, res) => {
  console.log("Welcome to our NeoCompiler Eco Services RPC API");
  res.status(200).send("Welcome to our NeoCompiler Eco Services RPC API: [socket.io], [/statusnode/:node - CN Routes], [/getvars - get commit] ");
});

app.post('/getvars', function(req, res){
  res.setHeader('Content-Type', 'text/json; charset="utf-8"');
  res.send('{"commit":"'+process.env.COMMIT_GIT_VERSION+'"}');
});

app.get('/statusnode/:node', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neocli-node'+req.params.node+'/*.log | tail -n 50';

  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.send(x);
    }
  });
});

// ============================================================
// ================== Socket io ===============================
const Connections = require('./socket-js/connections.js');
let conn = new Connections();
var io = require('socket.io').listen(server);
var timeleft = (12*60*60*1000);
setInterval(function() {
  timeleft -= 1000;
  io.emit('timeleft', { timeleft: timeleft });
}, 1000);

io.set('origins', '*:*');

io.on('connection', function(socket){
  conn.addConnection();
  io.emit('userconnected', { online: conn.connections, since: conn.connectionsSince });
  socket.on('disconnect', function(){
    conn.removeConnection();
  });
});
// ============================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
