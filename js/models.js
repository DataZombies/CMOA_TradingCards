/*
 * MODELS & DATA
 */

var REPO = (function() {
  var models = {};
  var db = {
    cards: []
  };

  function prettyDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }

  models.Artist = function(a, w) {
    this.id = a["artist_id"];

    // TODO: Replace with custom HP algorithm
    this.hp = Math.ceil(100 * Math.random()) + 50;

    this.fullName = a["full_name"];
    this.nationality = a["nationality"];
    this.birthDate = prettyDate(new Date(a["birth_date"]));
    this.birthPlace = a["birth_place"] || '(N/A)';
    this.deathDate = a["death_date"] && prettyDate(new Date(a["death_date"]));
    this.deathPlace = a["death_place"] || '(N/A)';
    this.imageUrl = w.imageUrl;
    this.works = [];

    this.description = this.nationality + ' artist; born in ' +
      this.birthPlace + ' on ' + this.birthDate;

    if(this.deathDate) {
      this.description += '; died in ' + this.deathPlace + ' on ' +
        this.deathDate;
    }
  };

   models.Work = function(w) {
    this.id = w["id"];

    // TODO: Replace with custom damage algorithm
    this.damage = Math.ceil(100 * Math.random()) + 50;

    this.title = w["title"];
    this.dateCreated = prettyDate(new Date(w["creation_date_earliest"]));
    this.dateAcquired = prettyDate(new Date(w["date_acquired"]));
    this.medium = w["medium"];
    this.creditLine = w["credit_line"];
    this.itemWidth = w["item_width"];
    this.itemHeight = w["item_height"];
    this.itemDepth = w["item_depth"];
    this.itemHeight = w["item_height"];

    var images = w["images"] && w["images"][0];
    this.imageUrl = images && images["image_url"] && images["image_url"][0];
    this.imageUrl = this.imageUrl || "img/default.jpg";
  };

  // Seed DB with data
  DATA["things"].forEach(function(t) {
    if(!t["creator"]) return;

    var work = new models.Work(t);

    t["creator"].forEach(function(c) {
      var artist, index;

      db.cards.forEach(function(a, i) {
        if(a.id === c["artist_id"]) {
          index = i;
        }
      });

      if(index) {
        db.cards[index].works.push(work);
      } else {
        artist = new models.Artist(c, work);
        artist.works.push(work);
        db.cards.push(artist);
      }
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
