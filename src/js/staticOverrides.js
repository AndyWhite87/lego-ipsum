
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
