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
      self.renderFortune(fortune.content);
      self.renderRemainingTime(fortune.next);
      self.setTimer();
    });
  };
  
  this.renderFortune = function(fortune) {
    $('#fortune').text(fortune);
  };
  
  this.timer_id = null;

  this.setupBayeuxHandlers = function() {
    var self = this;

    $.getJSON("/config.json", function(config) {
      self.client = new Faye.Client('http://' + window.location.hostname + ':' + config.port + '/faye', {
        timeout: 120
      });

      self.client.subscribe('/refresh', function(fortune) {
        self.renderFortune(fortune.content);
        self.renderRemainingTime(fortune.next);
        self.setTimer();
      });
    });
  };
  
  this.renderRemainingTime = function(time_left) {
    if(time_left < 0){
      time_left = '?';
    }
    $('#time_left').text(time_left);
  };
  
  this.setTimer = function() {
    if(self.timer_id !== null){
      clearInterval(self.timer_id);
    }
    self.timer_id = setInterval(function() {
      self.renderRemainingTime(parseInt($('#time_left').text()) - 1);
    }, 1000);
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
