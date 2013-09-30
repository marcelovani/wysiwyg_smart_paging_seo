(function ($) {
  Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'] = {
    
    /**
     * Return whether the passed node belongs to this plugin.
     */
    isNode: function(node) {
      return $(node).is('.wysiwyg-sp-seo-img');
    },

    /**
     * Execute the button.
     */
    invoke: function(data, settings, instanceId) {
      // Display the Add form.
      if (data.content == "") {
        // Insert a Page Break.
        var smart_paging_settings = {};
        smart_paging_settings.path = settings.smart_paging_path + "/plugins/wysiwyg/smart_paging";
        if (typeof Drupal.wysiwyg.plugins['smart_paging'] != 'undefined') {
          Drupal.wysiwyg.plugins['smart_paging'].invoke(data, smart_paging_settings, instanceId);
        }

        // Alocate a new id.
        settings.data_id = 1;
        var regex = new RegExp(settings.metatag_markup['prefix'], 'gi');
        var matches = Drupal.wysiwyg.instances[instanceId].getContent().match(regex);
        
        if (matches != null) {
          settings.data_id = matches.length + 1;
        }
        settings.placeholder = this._getImgPlaceholder(settings);
        settings.mode = "Add";
      }
      // Display the Edit form.
      else {
        var regexp = new RegExp('<img.*?alt="(\\d+)".*?>', 'gi');
        var data_id = data.content.replace(regexp, '$1');
        settings.data_id = parseInt(data_id);
        settings.mode = "Edit";
      }
      // Show the input form.
      this.show_popup(settings, instanceId);
    },

    /**
     * Replace Metatags with image.
     */
    attach: function(content, settings, instanceId) {
      // Find all content from metatags markup.
      var regexp = new RegExp(settings.metatag_markup['prefix'] + '(.*?)' + settings.metatag_markup['suffix'], 'gi');
      var data_id_array = content.match(regexp);
      if (data_id_array != null) {
        for (var i = 0; i < data_id_array.length; i++) {
          var metatag_data = JSON.parse(data_id_array[i].replace(regexp, '$1', 'gi'));
          settings.data_id = metatag_data.data_id;
          
          // Store data.
          Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'].data[settings.data_id] = metatag_data;
          
          // Replace markup with image.
          content = content.replace(data_id_array[i], this._getImgPlaceholder(settings));
        }
      }
      return content;
    },

    /**
     * Replace images with Metatags.
     */
    detach: function(content, settings, instanceId) {
      // Find all Images.
      var regexp = new RegExp(
        settings.icon_markup['prefix'] + '.*?alt="(\\d+)".*?' +
        settings.icon_markup['suffix'], 'gi');
      var data_id_array = content.match(regexp);
      if (data_id_array != null) {
        for (var i = 0; i < data_id_array.length; i++) {
          var data_id = data_id_array[i].replace(regexp, '$1', 'gi');
          settings.data_id = data_id;
          
          // Generate markup using data from storage.
          var markup = JSON.stringify(Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'].data[settings.data_id]);
          
          // Replace image with markup.
          content = content.replace(data_id_array[i], 
            settings.metatag_markup['prefix'] + 
            markup + settings.metatag_markup['suffix']);
        }
      }
      return content;
    },

    /**
     * Shows the Form.
     */
    show_popup: function(settings, instanceId) {
      if (typeof settings.data_id == 'string') {
      	return;
      }

      // Check if the Form is not yet on the DOM.
      if ($('.wysiwyg-sp-seo-popup').length == 0) {
        // Print the form on the page.
        // Normalize the field names.
        form = settings.form_markup.replace(new RegExp('metatags\\[([\\w|:|-]+)\\]\\[value\\]', 'gi'), 'meta_name_$1_content');
        // Fix robots tags manually. @TODO: use RegExp here too.
        //form = form.replace("robots[", "robots:");
        //form = form.replace("]", "");
        jQuery("body").append(form);

        if (settings.mode == "Edit") {
          // Fill in the form values with json data.

          var metatags = Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'].data[settings.data_id];

          jQuery.each(metatags, function(name, value) {
            jQuery('.wysiwyg-sp-seo-popup [name=' + name + ']').val(value);
          });
        }
      }

      // Display popup centered on screen.
      jQuery(".wysiwyg-sp-seo-popup").center().show(function() {

        jQuery(".wysiwyg-sp-seo-popup form fieldset legend").click(function() {
          $(this).parent().toggleClass('collapsed');
        });

        // Listeners for buttons.
        jQuery(".wysiwyg-sp-seo-popup .insert").click(function() {
          // Get key/values from the form.
          var metatags = Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo']._getFormValues(settings);

          // Store the metatags.
          Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'].data[settings.data_id] = metatags;

          // Insert the placeholder image.
          if (settings.mode == "Add") {
            Drupal.wysiwyg.instances[instanceId].insert(settings.placeholder);
          }
          
          // Close popup.
          jQuery(".wysiwyg-sp-seo-popup").remove();
        });
        jQuery(".wysiwyg-sp-seo-popup .cancel").click(function() {
          jQuery(".wysiwyg-sp-seo-popup").remove();
        });
        // Catch keyboard events.
        jQuery(document).keydown(function(e) {
          // Esc key pressed.
          if (e.keyCode == 27) {
            jQuery(".wysiwyg-sp-seo-popup").remove();
          }
        });
        jQuery(".wysiwyg-sp-seo-popup *:input[type!=hidden]:first").focus();
      });
    },

    /**
     * Helper function to return a HTML placeholder.
     */
    _getImgPlaceholder: function (settings) {
      return settings.icon_markup['prefix'] +
        settings.icon_markup['src'].replace('alt=""', 'alt="' +
        settings.data_id + '"') +
        settings.icon_markup['suffix'];
    },
            
    /**
     * Helper function to return all values from the form.
     */
    _getFormValues: function(settings) {
      var metatags = {};
      metatags["data_id"] = settings.data_id;

      // Get values from the form. Only get values from input type: text, textarea
      jQuery('.wysiwyg-sp-seo-popup *').filter('input[type=text],textarea').each(function(key, value) {

        // Ignore fields that were not normalized when building the form, they wil have [] symbols.
        if (this.name.indexOf("[") == -1 && this.name.indexOf("]") == -1) {
          // Only override tags that contain values.
          if (this.value != "") {
            metatags[this.name] = this.value;
          }
        }
      });
      return metatags;
    },
  };

  // Storage.
  Drupal.wysiwyg.plugins['wysiwyg_smart_paging_seo'].data = {};
  
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
