/*
 * APP
 */

var APP = (function() {
  var deck;
  var myScroll;
  var playerCard = 0;

  window.addEventListener('load', function() {
    var playerCards = REPO.drawCards(5);

    deck = new CardView('#player-deck', {
      dataset: playerCards,
      onUpdateContent: function(el, data) {
        playerCard = this.currCard;

        el.querySelector('img').src = data.imageUrl;
        el.querySelector('h3').innerHTML = data.fullName;
        el.querySelector('p').innerHTML = data.description;
      }
    });

    //myScroll = new IScroll('#categories', {
      //fadeScrollbars: true,
      //interactiveScrollbars: true,
      //mouseWheel: true,
      //scrollbars: true,
      //shrinkScrollbars: 'scale',
      //tap: true,
      //scrollX: true,
      //scrollY: false
    //});

    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
  });

  function GameViewModel() {
    var self = this;

    self.rounds = ko.observable(5);
    self.playerScore = ko.observable(0);
    self.computerScore = ko.observable(0)

    self.chooseCard = function() {
      console.log();
    };
    //this.timer = ko.observable(10);

    //var timer = setInterval(function() {
      //if(self.timer() === 0) return clearInterval(timer);
      //self.timer(self.timer() - 1);
    //}, 1000);
  }

  ko.applyBindings(new GameViewModel());
})();
