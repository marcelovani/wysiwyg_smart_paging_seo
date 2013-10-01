(function ($) {
  Drupal.wysiwyg.plugins['smart_paging_url'] = {
    
    /**
     * Return whether the passed node belongs to this plugin.
     */
    isNode: function(node) {
      return $(node).is('.wysiwyg-sp-url-img');
    },

    /**
     * Execute the button.
     */
    invoke: function(data, settings, instanceId) {
      if (data.content == "") {
        settings.url = "";
        settings.mode = "Add";
      }
      else {
        // Get the alt text from the placeholder img.
        var regexp = new RegExp('<img.*?alt="(\\w+?)".*?>', 'gi');
        settings.url = data.content.replace(regexp, '$1');
        settings.mode = "Edit";
      }
      // Show the input form.
      this.show_popup(data, settings, instanceId);
    },

    /**
     * Replace Url Markup with image.
     */
    attach: function(content, settings, instanceId) {
      content = Drupal.wysiwyg.plugins['smart_paging_url']._markupToPlaceholder(content, settings);
      return content;
    },

    /**
     * Replace images with Url markup.
     */
    detach: function(content, settings, instanceId) {
      content = Drupal.wysiwyg.plugins['smart_paging_url']._placeholderToMarkup(content, settings);
      return content;
    },

    /**
     * Shows the Form.
     */
    show_popup: function(data, settings, instanceId) {
      var original_values = {};
      var edit_values = {};
      // Check if the Form is not yet on the DOM.
      if ($('.wysiwyg-sp-url-popup').length == 0) {
        // Print the form on the page.
        var form = settings.form_markup
        jQuery("body").append(form);

        if (settings.mode == "Edit") {
          // Fill in the form values.
          original_values.url = original = settings.url;
          jQuery.each(original_values, function(name, value) {
            jQuery('.wysiwyg-sp-url-popup [name=' + name + ']').val(value);
          });
        }
      }
      // Display popup centered on screen.
      jQuery(".wysiwyg-sp-url-popup").center().show(function() {

        jQuery(".wysiwyg-sp-url-popup form fieldset legend").click(function() {
          $(this).parent().toggleClass('collapsed');
        });
        // Listeners for buttons.
        jQuery(".wysiwyg-sp-url-popup .insert").click(function() {
          // Get key/values from the form.
          edit_values = Drupal.wysiwyg.plugins['smart_paging_url']._getFormValues(settings);
          if (settings.mode == "Add") {
            // Insert the placeholder image.
            settings.url = edit_values.url;
            settings.placeholder = Drupal.wysiwyg.plugins['smart_paging_url']._getImgPlaceholder(settings);
            Drupal.wysiwyg.instances[instanceId].insert(settings.placeholder);
          }
          else {
            // Replace the alt text.
            var content = Drupal.wysiwyg.instances[instanceId].getContent();
            if (original_values.url !== edit_values.url) {
              var search = settings.url_markup['prefix'] + original_values.url + settings.url_markup['suffix'];
              var replace = settings.url_markup['prefix'] + edit_values.url + settings.url_markup['suffix'];
              Drupal.wysiwyg.instances[instanceId].setContent(content.replace(search, replace));
            }
          }
          // Close popup.
          jQuery(".wysiwyg-sp-url-popup").remove();
        });

        jQuery(".wysiwyg-sp-url-popup .cancel").click(function() {
          jQuery(".wysiwyg-sp-url-popup").remove();
        });
        // Catch keyboard events.
        jQuery(document).keydown(function(e) {
          // Esc key pressed.
          if (e.keyCode == 27) {
            jQuery(".wysiwyg-sp-url-popup").remove();
          }
        });
        jQuery(".wysiwyg-sp-url-popup *:input[type!=hidden]:first").focus();
      });
    },

    /**
     * Helper function to return a HTML placeholder.
     */
    _getImgPlaceholder: function (settings) {
      return settings.icon_markup['prefix'] +
        settings.icon_markup['src'].replace('alt=""', 'alt="' +
        settings.url + '"') +
        settings.icon_markup['suffix'];
    },
            
    /**
     * Helper function to return all values from the form.
     */
    _getFormValues: function(settings) {
      var values = {};
      //values["data"] = settings.url;

      // Get values from the form. Only get values from input type: text, textarea
      jQuery('.wysiwyg-sp-url-popup *').filter('input[type=text],textarea').each(function(key, value) {
          // Only override tags that contain values.
          if (this.value != "") {
              values[this.name] = this.value;
          }
      });
      return values;
    },

    /**
    * Helper to replace Url markup with paceholder img.
    */
    _markupToPlaceholder: function(content, settings) {
      // Find all Url markup tags.
      var regexp = new RegExp(settings.url_markup['prefix'] + '(.*?)' + settings.url_markup['suffix'], 'gi');
      var data_array = content.match(regexp);
      if (data_array != null) {
        for (var i = 0; i < data_array.length; i++) {
          settings.url = data_array[i].replace(regexp, '$1', 'gi');
            // Replace markup with image.
            content = content.replace(data_array[i], this._getImgPlaceholder(settings));
          }
      }
      return content;
    },

    /**
     * Helper to replace paceholder img with Url markup.
     */
    _placeholderToMarkup: function(content, settings) {
      // Find all Images.
      var regexp = new RegExp(
        settings.icon_markup['prefix'] + '.*?alt="(\\w+?)".*?' +
           settings.icon_markup['suffix'], 'gi');
        var data_array = content.match(regexp);
        if (data_array != null) {
          for (var i = 0; i < data_array.length; i++) {
            settings.url = data_array[i].replace(regexp, '$1', 'gi');

            // Replace image with markup.
            content = content.replace(data_array[i],
              settings.url_markup['prefix'] +
              settings.url.toString() + settings.url_markup['suffix']);
          }
        }
        return content;
    },
  };

})(jQuery);

/**
 * Center the element on the screen.
 */
if (!jQuery.fn.center) {
  jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, ((jQuery(window).height() -
      jQuery(this).outerHeight()) / 2) +
      jQuery(window).scrollTop()) + "px");
    this.css("left", Math.max(0, ((jQuery(window).width() -
      jQuery(this).outerWidth()) / 2) +
      jQuery(window).scrollLeft()) + "px");
    return this;
  }
}
