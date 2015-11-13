
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