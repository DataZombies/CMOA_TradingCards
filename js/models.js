/*
 * MODELS & DATA
 */

var REPO = (function() {
  var models = {};
  var db = {
    cards: []
  };

  models.Artist = function(data) {
    this.id = data["artist_id"];
    this.fullName = data["full_name"];
    this.nationality = data["nationality"];
    this.birthDate = data["birth_date"];
    this.birthPlace = data["birth_place"];
    this.deathDate = data["death_date"];
    this.deathPlace = data["death_place"];
    this.works = [];
  }

   models.Work = function(data) {
    this.id = data["id"];
    this.title = data["title"];
    this.dateCreated = data["creation_date_earliest"];
    this.dateAcquired = data["date_acquired"];
    this.medium = data["medium"];
    this.creditLine = data["credit_line"];
    this.itemWidth = data["item_width"];
    this.itemHeight = data["item_height"];
    this.itemDepth = data["item_depth"];
    this.itemHeight = data["item_height"];
  }

  // Seed DB with data
  DATA["things"].forEach(function(t) {
    if(!t["creator"]) return;

    var work = new models.Work(t);

    t["creator"].forEach(function(c) {
      if(db.cards.some(function(a) { return a.id === c["artist_id"] })) return;

      var a = new models.Artist(c);
      a.works.push(work);
      db.cards.push(a);
    });
  });

  // Draw a sample of cards from the deck
  function drawCards(n) {
    var nc = n || 5;
    return _.sample(db.cards, nc);
  }

  return {
    models: models,
    drawCards: drawCards
  };
})();

console.log(REPO.drawCards(5))
