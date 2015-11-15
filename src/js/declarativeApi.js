
  // Find and act upon LegoIpsum declarations

  (function () {

    var legoIpsumEls = document.querySelectorAll('[lego-ipsum]');
    if (legoIpsumEls === null) {
      return;
    }

    var getType = function(el) {
      var providedType = el.getAttribute('lego-ipsum').toLowerCase();
      var defaultType = 'phrase';

      switch (providedType) {
        case 'word':
        case 'phrase':
        case 'sentence':
        case 'paragraph':
          return providedType;
        default:
          return defaultType;
      }
    };

    var getQuery = function(el, type) {
      var count = parseInt(el.getAttribute('lego-ipsum-count')) || 1;

      switch (type) {
        case 'word':
        case 'phrase':
          return count + 'w';
        case 'sentence':
          return count + 's';
        case 'paragraph':
          return count + 'p';
      }
    };

    var getSentenceCase = function(el, type) {
      if (type === 'sentence' || type === 'paragraph') {
        return false;
      }
      return el.getAttribute('lego-ipsum-sentence-format').toLowerCase() === 'true';
    };

    for (var i = 0; i < legoIpsumEls.length; i++) {

      // Get each element's type and infer a query from it and whether to use sentence casing 
      var el = legoIpsumEls[i];
      var type = getType(el);
      var query = getQuery(el, type);
      var sentenceCase = getSentenceCase(el, type);

      // Run LegoIpsum on the element with requested settings
      var legoIpsum = new LegoIpsum();
      legoIpsum.type = LegoIpsum.TEXT;
      legoIpsum.query = query;
      legoIpsum.createLegoIpsum(el);

      // Transform element's text to sentence format if requested
      if (sentenceCase) {
        el.textContent = el.textContent.substr(0, 1).toUpperCase() + el.textContent.substr(1);
        el.textContent = el.textContent + '.';
      }

    }

  })();
