/*
 * MODELS & DATA
 */

var app = (function() {
  var DB = {
    cards: []
  };

  function Artist(data) {
    this.id = data["artist_id"];
    this.fullName = data["full_name"];
    this.nationality = data["nationality"];
    this.birthDate = data["birth_date"];
    this.birthPlace = data["birth_place"];
    this.deathDate = data["death_date"];
    this.deathPlace = data["death_place"];
    this.works = [];
  }

  function Work(data) {
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

    var work = new Work(t);

    t["creator"].forEach(function(c) {
      if(DB.cards.some(function(a) { return a.id === c["artist_id"] })) return;

      var a = new Artist(c);
      a.works.push(work);
      DB.cards.push(a);
    });
  });

  // Draw a sample of cards from the deck
  function drawCards(n) {
    var nc = n || 5;
    return _.sample(DB.cards, nc);
  }

  return {
    drawCards: drawCards
  };
})();

console.log(app.drawCards(5))
