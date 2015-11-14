
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