<?php

/**
 * @file
 * Implement Wysiwyg module hooks.
 */

/**
 * Implements hook_wysiwyg_module_plugin().
 */
function wysiwyg_smart_paging_seo_wysiwyg_smart_paging_seo_plugin() {
  $plugins['smart_paging_metatag'] = array(
    'title' => t('Smart Paging Metatag'),
    'vendor url' => 'http://drupal.org/project/wysiwyg_smart_paging_seo',
    'icon title' => t('Add Metatag to each Smart Page'),
    'css path' => drupal_get_path('module', 'wysiwyg_smart_paging_seo'),
    'css file' => 'wysiwyg_smart_paging_seo.css',
    'settings'   => array(
      'smart_paging_path' => drupal_get_path('module', 'smart_paging'),
      'form_markup' => drupal_render(wysiwyg_smart_paging_metatag_form()),
      'icon_markup' => array(
        'prefix' => '<span class="wysiwyg-sp-metatag">',
        'src' => '<img src="' .
          drupal_get_path('module', 'wysiwyg_smart_paging_seo') .
          '/plugins/smart_paging_metatag/images/smart_paging_metatag.png' .
          '" ' . 'alt="" title="Metatags" ' .
          'class="wysiwyg-sp-metatag-img" >',
        'suffix' => '</span>',
      ),
      'metatag_markup' => array(
        'prefix' => '<!--smartpagingmeta ',
        'suffix' => '-->',
      ),
    ),
  );
  $plugins['smart_paging_url'] = array(
    'title' => t('Smart Paging URL'),
    'vendor url' => 'http://drupal.org/project/wysiwyg_smart_paging_seo',
    'icon title' => t('Add a URL to each Smart Page'),
    'css path' => drupal_get_path('module', 'wysiwyg_smart_paging_seo'),
    'css file' => 'wysiwyg_smart_paging_seo.css',
    'settings'   => array(
      'form_markup' => drupal_render(wysiwyg_smart_paging_url_form()),
      'icon_markup' => array(
        'prefix' => '<span class="wysiwyg-sp-url">',
        'src' => '<img src="' .
          drupal_get_path('module', 'wysiwyg_smart_paging_seo') .
          '/plugins/smart_paging_url/images/smart_paging_url.png' .
          '" ' . 'alt="" title="URL" ' .
          'class="wysiwyg-sp-url-img" >',
        'suffix' => '</span>',
      ),
      'url_markup' => array(
        'prefix' => '<!--smartpagingurl "',
        'suffix' => '"-->',
      ),
    ),
  );
  return $plugins;
}
