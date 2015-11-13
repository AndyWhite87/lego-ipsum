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

  LegoIpsum.TEXT = 2;

  LegoIpsum.TYPE = {
    PARAGRAPH: 1,
    SENTENCE: 2,
    WORD: 3
  };


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
  "spaceships", "spaceship spaceship spaceship",
  "sigfigs", "SNOT", "swooshable",
  "TFOLs", "vignettes", "bignettes"

  ];

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

        // TODO For now, using lorempixum
        var path = '';
        var options = this.query.split(' ');

        if (options[0] === 'gray') {
          path += '/g';
          options[0] = '';
        }

        if (element.getAttribute('width')) {
          path += '/' + element.getAttribute('width');
        }

        if (element.getAttribute('height')) {
          path += '/' + element.getAttribute('height');
        }

        path += '/' + options.join(' ').replace(/(^\s+|\s+$)/, '');
        element.src = 'http://lorempixum.com'+path.replace(/\/\//, '/');

      }
    }

    if (element === null) {
      return lorem;
    }

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

  // Register jQuery plugin
  if (typeof jQuery !== 'undefined') {

    (function($) {
      
      $.fn.legoIpsum = function() {

        $(this).each(function() {
          var legoIpsum = new LegoIpsum();
          legoIpsum.type = $(this).is('img') ? LegoIpsum.IMAGE : LegoIpsum.TEXT;
          legoIpsum.query = $(this).data('lego');
          legoIpsum.createLegoIpsum(this);
        });

      };

      $(document).ready(function() {
        $('[data-lego]').lorem();
      });

    })(jQuery);
    
  }

  // Random integer method
  LegoIpsum.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

})();
