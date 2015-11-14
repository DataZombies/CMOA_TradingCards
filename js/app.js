/*
 * APP
 */

function GameViewModel() {
  var self = this;

  this.rounds = ko.observable(5);
  this.playerScore = ko.observable(0);
  this.timer = ko.observable(10);

  var timer = setInterval(function() {
    if(self.timer() === 0) return clearInterval(timer);
    self.timer(self.timer() - 1);
  }, 1000);
}

ko.applyBindings(new GameViewModel());
