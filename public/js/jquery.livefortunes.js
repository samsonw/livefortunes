function LiveFortunesClient () {
  if(! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  this.init = function() {
    var self = this;
    self.setupBayeuxHandlers();
    self.showFortune();
  };

  this.showFortune = function() {
    var self = this;
    $.getJSON("/fortune.json", function(fortune) {
      self.renderFortune(fortune.fortune);
    });
  };
  
  this.renderFortune = function(fortune) {
    $('#fortune').text(fortune);
  };

  this.setupBayeuxHandlers = function() {
    var self = this;

    $.getJSON("/config.json", function(config) {
      self.client = new Faye.Client('http://' + window.location.hostname + ':' + config.port + '/faye', {
        timeout: 120
      });

      self.client.subscribe('/refresh', function(fortune) {
        self.renderFortune(fortune.fortune);
      });
    });
  };

  this.init();
}

var LiveFortunesClient;
jQuery(function() {
  liveFortunesClient = new LiveFortunesClient();
  $('a.refresh').click(function() {
    liveFortunesClient.showFortune();
  });
  $('a.push').click(function() {
    $.get('/refresh');
  });
});
