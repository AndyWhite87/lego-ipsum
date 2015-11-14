
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

  // Overwrite variables based on data-attrs

  (function () {
    var scriptTag = document.querySelector('script[data-minifig-path]');
    if (scriptTag !== null) {
      var minifigPath = scriptTag.getAttribute("data-minifig-path");
      if (typeof minifigPath !== 'undefined' && minifigPath !== null) {
        LegoIpsum.IMAGE_FOLDER = minifigPath;
      }
    }
  })();
