var http = require('http'),
    util  = require('util'),
    exec = require('child_process').exec,
    express = require('express'),
    faye = require('faye');

function LiveFortunes(options) {
  // make sure new is called
  if(! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.settings = {
    port: options.port,
    refresh_interval: options.refresh_interval
  };

  self.next_refresh = self.settings.refresh_interval - 1;

  self.init();
}

LiveFortunes.prototype.init = function() {
  var self = this;

  self.bayeux = self.createBayeuxServer();
  self.httpServer = self.createHTTPServer();

  self.bayeux.attach(self.httpServer);
  self.httpServer.listen(self.settings.port);
  util.log('Server started on PORT ' + self.settings.port);
  setInterval(function() {
    self.next_refresh = (self.next_refresh - 1 + self.settings.refresh_interval) % self.settings.refresh_interval;
  }, 1000);
  setInterval(function(){
    self.next_refresh = self.settings.refresh_interval - 1;
    self.processFortune(function(fortune) {
      self.bayeux.getClient().publish('/refresh', {content: fortune, next: self.next_refresh, interval: self.settings.refresh_interval});
    })
  }, self.settings.refresh_interval * 1000);
};

LiveFortunes.prototype.createBayeuxServer = function() {
  var self = this;
  
  var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
  });
  
  return bayeux;
};

LiveFortunes.prototype.createHTTPServer = function() {
  var self = this;

  var app = express.createServer();
  app.configure(function () {
    app.use(express.static(__dirname + '/../public'));
  });
  
  app.get('/config.json', function(req, res) {
    res.send({
        port: self.settings.port
      , refresh_interval: self.settings.refresh_interval
    });
  });
  
  app.get('/fortune.json', function(req, res) {
    self.processFortune(function(fortune) {
      res.send({content: fortune, next: self.next_refresh, interval: self.settings.refresh_interval});
    });
  });
  
  app.get('/refresh', function(req, res) {
    self.processFortune(function(fortune) {
      self.bayeux.getClient().publish('/refresh', {content: fortune, next: self.next_refresh, interval: self.settings.refresh_interval});
      res.send(200);
    });
  });

  return app;
};

LiveFortunes.prototype.processFortune = function(callback) {
  exec('fortune', function (error, stdout, stderr) {
    if (stderr !== null && stderr !== '') {
      console.log('stderr: ' + stderr);
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log(stdout);
    callback(stdout);
  });
}

module.exports = LiveFortunes;
