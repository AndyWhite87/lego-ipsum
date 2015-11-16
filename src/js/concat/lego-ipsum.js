/* Lego Ipsum | https://github.com/AndyWhite87/lego-ipsum | GNU LESSER GENERAL PUBLIC LICENSE
 * Andy White | https://twitter.com/etihWydnA
 */
var LegoIpsum;
;(function() {

"use strict";


  // Initialize the LegoIpsum constructor
  LegoIpsum = function () {

    // Default values
    this.type = null;
    this.query = null;
    this.data = null;
    
  };


  // Static variables

  LegoIpsum.IMAGE = 1;

  LegoIpsum.TOTAL_IMAGES = 55;

  LegoIpsum.IMAGE_FOLDER = './img/figs/';

  LegoIpsum.TEXT = 2;

  LegoIpsum.TYPE = {
    PARAGRAPH: 1,
    SENTENCE: 2,
    WORD: 3
  };


  // Overwrite initial static variables based on data-attrs

  (function () {

    // Get the LegoIpsum script tag
    var scriptTag = document.querySelector('script[data-minifig-path]');
    if (scriptTag === null) {
      return;
    }

    // Override path to minifig images if 'data-minifig-path' attr is present
    var minifigPath = scriptTag.getAttribute('data-minifig-path');
    if (typeof minifigPath !== 'undefined' && minifigPath !== null) {
      LegoIpsum.IMAGE_FOLDER = minifigPath;
    }

  })();


  // Words to use when creating Lego ipsum text
  LegoIpsum.WORDS = [

  // General terms
  "Lego", "Technic", "Duplo",
  "bricks", "plates", "studs",
  "minifigs", "hinges", "turntables",

  // Sizes
  "2 x 4", "4 x 4", "8 x 2",

  // Piece types, from http://shop.lego.com/en-GB/Pick-A-Brick-ByTheme
  // TODO Add more piece types from same resource
  "accessories", "animals & creatures",
  "connectors", "scaffolds", "decoration elements",
  "fences","ladders", "cockpits", "functional elements",
  "gates", "roofs", "miscellaneous",
  "not approved new elements", "plants",
  "signs, flags and poles",
  "transportation", "tubes",
  "wall elements", "wheels",

  // Basic colors, from http://shop.lego.com/en-GB/Pick-A-Brick-ByTheme
  "black", "blue", "grey", "purple", "red", "white", "yellow",

  // Exact colors, from http://shop.lego.com/en-GB/Pick-A-Brick-ByTheme
  "dark azure", "Earth blue", "medium azure", "dark stone grey",
  "titan metal", "light purple", "new dark red", "cool yellow",

  // And let's not forget
  "space grey",

  // Community terms, from http://www.brothers-brick.com/lego-glossary/
  "AFOLs", "ALEs",
  "bandwagon", "Billund", "brick-built", "BURP",
  "cheese slope", "clone", "custom",
  "dark ages", "dioramas",
  "greebles", "half-stud offset", "inventory",
  "jumper plates", "KFOLs", "LUGs",
  "MOC", "parts packs", "purist", "rainbow warriors",
  "sigfigs", "SNOT", "swooshable",
  "TFOLs", "vignettes", "bignettes",

  // The Lego Movie
  "spaceships", "spaceship spaceship spaceship",
  "Cloud Cuckooland",
  "Kragle", "Octan", "Piece of Resistance",
  "Emmet", "The Special", "Wyldstyle", "Vitruvius", "Unikitty", "Benny", "Metalbeard",
  "President Business", "Bad Cop", "Good Cop",
  "awesome", "everything is awesome"

  ];


  // Random integer method
  LegoIpsum.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  // Text creator method with parameters: how many, what type
  LegoIpsum.prototype.createText = function(count, type) {

    switch (type) {

      // Paragraphs are groups of sentences
      case LegoIpsum.TYPE.PARAGRAPH:

        var paragraphs = [];
      
        for (var i = 0; i < count; i++) {
          var paragraphLength = this.randomInt(10, 20);
          var paragraph = this.createText(paragraphLength, LegoIpsum.TYPE.SENTENCE);
          paragraphs.push('<p>' + paragraph + '</p>');
        }
      
        return paragraphs.join('\n');

      // Sentences are groups of words
      case LegoIpsum.TYPE.SENTENCE:
      
        var sentences = [];
      
        for (var j = 0; j < count; j++) {
          var sentenceLength = this.randomInt(3, 7);
          var words = [];
          for (var w = 0; w < sentenceLength; w++) {
            var word = this.createText(1, LegoIpsum.TYPE.WORD);
            words.push(word);
          }
          words[0] = words[0].substr(0, 1).toUpperCase() + words[0].substr(1);
          var sentence = words.join(' ');
          sentences.push(sentence);
        }
      
        return (sentences.join('. ') + '.').replace(/(\.\,|\,\.)/g, '.');

      // Words are single words
      case LegoIpsum.TYPE.WORD:

        var wordIndex = this.randomInt(0, LegoIpsum.WORDS.length - count - 1);
        return LegoIpsum.WORDS.slice(wordIndex, wordIndex + count).join(' ').replace(/\.|\,/g, '');

    }

  };

  // Main creation method
  LegoIpsum.prototype.createLegoIpsum = function(element) {

    var lorem = [];
    var count, type;

    if (/\d+-\d+[psw]/.test(this.query)) {
      var range = this.query.replace(/[a-z]/,'').split("-");
      count = Math.floor(Math.random() * parseInt(range[1])) + parseInt(range[0]);
    }
    else {
      count = parseInt(this.query); 
    }

    if (/\d+p/.test(this.query)) {
      type = LegoIpsum.TYPE.PARAGRAPH;
    }
    else if (/\d+s/.test(this.query)) {
      type = LegoIpsum.TYPE.SENTENCE;
    }
    else if (/\d+w/.test(this.query)) {
      type = LegoIpsum.TYPE.WORD;
    }

    lorem.push(this.createText(count, type));
    lorem = lorem.join(' ');

    if (element) {

      if (this.type === LegoIpsum.TEXT) {
        element.innerHTML += lorem;
      }

      else if (this.type === LegoIpsum.IMAGE) {

        // Append the requested number of minifigs. Default to 1
        count = parseInt(this.query) || 1;

        // Record which minifigs have already been used. This will be cleared if all are used
        var usedFigs = [];
        var loop = 0;

        while (loop < count) {

          var fig = this.randomInt(1, LegoIpsum.TOTAL_IMAGES);

          if (usedFigs.indexOf(fig) === -1) {

            usedFigs.push(fig);
            var path = LegoIpsum.IMAGE_FOLDER + fig + '.png';
            var img = document.createElement('img');
            img.setAttribute('class', 'minifig');
            img.src = path;
            element.appendChild(img);

            // Reset usedFigs array if all have been used
            if (usedFigs.length === LegoIpsum.TOTAL_IMAGES) {
              usedFigs = [];
            }

            loop++;

          }
        }

      }
    }

    if (element === null) {
      return lorem;
    }

  };

  // Find and act upon LegoIpsum declarations

  (function () {

    // Declarative attributes
    var attrs = {
      core: 'lego-ipsum'
    };
    attrs.count = attrs.core + '-count';
    attrs.format = attrs.core + '-format';

    // Run declarative functionality if one or more Lego Ipsum elements are present
    var legoIpsumEls = document.querySelectorAll('[' + attrs.core + ']');
    if (legoIpsumEls === null) {
      return;
    }

    var getRequest = function(el) {
      var providedRequest = el.getAttribute(attrs.core).toLowerCase();
      var defaultRequest = 'phrase';

      switch (providedRequest) {
        case 'image':
        case 'word':
        case 'phrase':
        case 'sentence':
        case 'paragraph':
          return providedRequest;
        default:
          return defaultRequest;
      }
    };

    var getType = function(request) {      
      switch (request) {
        case 'image':
          return 'IMAGE';
        default:
          return 'TEXT';
      }
    };

    var getQuery = function(el, request) {
      var count = parseInt(el.getAttribute(attrs.count)) || 1;

      switch (request) {
        case 'image':
          return count;
        case 'sentence':
          return count + 's';
        case 'paragraph':
          return count + 'p';
        default:
          return count + 'w';        
      }
    };

    var getSentenceCase = function(el, request) {
      if (request === 'word' || request === 'phrase') {
        return el.getAttribute(attrs.format) !== null;
      }
      return false;
    };

    for (var i = 0; i < legoIpsumEls.length; i++) {

      // Get each element's type and infer a query from it and whether to use sentence casing 
      var el = legoIpsumEls[i];
      var request = getRequest(el);
      var query = getQuery(el, request);
      var sentenceCase = getSentenceCase(el, request);
      var type = getType(request);

      // Run LegoIpsum on the element with requested settings
      var legoIpsum = new LegoIpsum();
      legoIpsum.type = LegoIpsum[type];
      legoIpsum.query = query;
      legoIpsum.createLegoIpsum(el);

      // Transform element's text to sentence format if requested and applicable
      if (sentenceCase) {
        el.textContent = el.textContent.substr(0, 1).toUpperCase() + el.textContent.substr(1);
        el.textContent = el.textContent + '.';
      }

    }

  })();

})();
