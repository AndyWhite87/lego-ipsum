
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
          var sentenceLength = this.randomInt(5, 10);
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