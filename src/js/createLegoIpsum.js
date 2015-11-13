
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