
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
