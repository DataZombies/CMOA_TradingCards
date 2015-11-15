/*
 * APP
 */

var APP = (function() {
  var playerDeck, computerDeck;
  var myScroll;
  var playerCards, computerCards;
  var playerCard = 0;
  var cardsInDeck;

  function LedgerEntry(data) {
    this.content = data.content;
    this.imageUrl = data.imageUrl;
  }

  /* http://www.sitepoint.com/delay-sleep-pause-wait/ */
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  function createPlayerDeck() {
    if(playerDeck) playerDeck.destroy();

    playerDeck = new CardView('#player-deck', {
      dataset: playerCards,
      onUpdateContent: function(el, data) {
        playerCard = this.page || playerCard;

        if(data) {
          el.querySelector('img').src = data.imageUrl;
          el.querySelector('.card__title').innerHTML = data.fullName;
          el.querySelector('.card__hp').innerHTML = data.hp;
          el.querySelector('p').innerHTML = data.description;
        }
      }
    });
  }

  window.addEventListener('load', function() {
    // NOTE: Load in more cards than rounds to avoid
    // card rendering issues
    cardsInDeck = 8;

    playerCards = REPO.drawCards(cardsInDeck);
    computerCards = REPO.drawCards(cardsInDeck);

    createPlayerDeck();

    // TODO: Incorporate categories
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

    ko.applyBindings(new GameViewModel());

    var loading = document.getElementById('loading');
    var game = document.getElementById('game');

    loading.style.display = 'none';
    game.style.display = 'block';
  });

  function GameViewModel() {
    var self = this;

    function addToLedger(data) {
      self.ledger.unshift(new LedgerEntry(data));
    }

    function dealDamage(a, damage) {
      a.hp -= damage;
      if(a.hp <= 0) a.hp = 0;
      return a;
    }

    function heal(a, health) {
      a.hp += health;
      if(a.hp > a.maxHP) a.hp = a.maxHP;
      return a;
    }

    function restartGame() {
      playerCards = REPO.drawCards(cardsInDeck);
      computerCards = REPO.drawCards(cardsInDeck);
      createPlayerDeck();
      resetDefaults();
      addToLedger({ content: 'A new challenger approaches!' });
    }

    function nextRound() {
      var round = self.round();
      var content;

      playerCard = 0;

      if(round < self.rounds()) {
        self.round(round + 1);
        self.playerCard(false);
        self.computerCard(false);
        createPlayerDeck();
      } else {
        if(self.playerScore() > self.computerScore()) {
          content = 'Triumph! You WIN!';
        } else if(self.playerScore() < self.computerScore()) {
          content = 'No luck! You LOSE!';
        } else {
          content = 'Where\'s your suit? We have a TIE!';
        }

        addToLedger({ content: content });
        restartGame();
      }

      return 'nextround';
    }

    function resetDefaults() {
      self.round(1);
      self.rounds(5);
      self.playerScore(0);
      self.playerCard(false);
      self.playerWork(false);
      self.computerScore(0);
      self.computerCard(false);
      self.computerWork(false);
    }

    self.round = ko.observable(1);
    self.rounds = ko.observable(5);

    self.playerScore = ko.observable(0);
    self.playerCard = ko.observable(false);
    self.playerWork = ko.observable(false);

    self.computerScore = ko.observable(0)
    self.computerCard = ko.observable(false);
    self.computerWork = ko.observable(false);

    self.ledger = ko.observableArray([
      new LedgerEntry({
        content: 'It is on this ledger that your trials shall be narrated. ' +
                 'Stay apprised; you\'re rewriting history, after all.'
      })
    ]);

    self.chooseCard = function() {
      var pCard = playerCards.splice(playerCard, 1)[0];
      self.playerCard(pCard);

      addToLedger({
        content: 'You chose an artist: ' + pCard.fullName + '.'
      });

      var cCardIndex = Math.floor(Math.random() * computerCards.length);
      var cCard = computerCards.splice(cCardIndex, 1)[0];
      self.computerCard(cCard);

      addToLedger({
        content: 'The computer chose an artist: ' + cCard.fullName + '.'
      });
    };

    self.chooseWork = function(w) {
      self.playerWork(w);

      function playerTurn() {
        if(w.castType === 'damaging') {
           // Deal damage to the computer
          var affectedCCard = dealDamage(self.computerCard(), w.castMagnitude);
          self.computerCard(affectedCCard);
          addToLedger({
            content: 'You played an artwork (' + w.title + ') and ' +
                     'delivered ' + w.castMagnitude + ' damage to your opponent!'
          });

          // If the computer card's HP is 0, add constant (20) to
          // player's score and move to next round
          if(affectedCCard.hp === 0) {
            self.playerScore(self.playerScore() + 20);
            addToLedger({
              content: 'You won round ' + self.round() + '!'
            });
            return nextRound();
          }

        // Heal!
        } else {
          var affectedPCard = heal(self.playerCard(), w.castMagnitude);
          self.playerCard(affectedPCard);
          addToLedger({
            content: 'You played an artwork (' + w.title + ') and ' +
                     'healed yourself by ' + w.castMagnitude + ' HP!'
          });
        }
      }

      function computerTurn() {
        var cWorkIndex = Math.floor(Math.random() * self.computerCard().works.length);
        var cWork = self.computerCard().works[cWorkIndex];

        if(cWork.castType === 'damaging') {
          // Computer deals damage to player
          var affectedPCard = dealDamage(self.playerCard(), cWork.castMagnitude);
          self.playerCard(affectedPCard);
          addToLedger({
            content: 'The computer played an artwork (' + cWork.title + ') and ' +
                     'delivered ' + cWork.castMagnitude + ' damage to you!'
          });

          // If the player card's HP is 0, add constant (20) to
          // computer's score and move to next round
          if(affectedPCard.hp === 0) {
            self.computerScore(self.computerScore() + 20);
            addToLedger({
              content: 'The computer won round ' + self.round() + '!'
            });
            return nextRound();
          }
        // Heal!
        } else {
          var affectedCCard = heal(self.computerCard(), cWork.castMagnitude);
          self.computerCard(affectedCCard);
          addToLedger({
            content: 'The computer played an artwork (' + cWork.title + ') and ' +
                     'healed itself by ' + cWork.castMagnitude + ' HP!'
          });
        }
      }

      // Give player a slight edge
      if(self.round() % 2 == 0) {
        if(computerTurn() !== 'nextround') return playerTurn();
      } else {
        if(playerTurn() !== 'nextround') return computerTurn();
      }
    };
  }
})();
