<?php

/**
 * @file
 * Implement Wysiwyg module hooks.
 */

/**
 * Implements hook_wysiwyg_module_plugin().
 */
function wysiwyg_smart_paging_seo_wysiwyg_smart_paging_seo_plugin() {
  $plugins['wysiwyg_smart_paging_seo'] = array(
    'title' => t('Wysiwyg Smart Paging SEO'),
    'vendor url' => 'http://drupal.org/project/wysiwyg_smart_paging_seo',
    'icon title' => t('Add Wysiwyg Smart Paging SEO to content'),
    'css path' => drupal_get_path('module', 'wysiwyg_smart_paging_seo'),
    'css file' => 'wysiwyg_smart_paging_seo.css',
    'settings'   => array(
      'smart_paging_path' => drupal_get_path('module', 'smart_paging'),
      'form_markup' => drupal_render(wysiwyg_smart_paging_seo_form()),
      'icon_markup' => array(
        'prefix' => '<span class="wysiwyg-sp-seo">',
        'src' => '<img src="' .
          drupal_get_path('module', 'wysiwyg_smart_paging_seo') .
          '/plugins/wysiwyg_smart_paging_seo/images/wysiwyg_smart_paging_seo.png' .
          '" ' . 'alt="" title="Metatags" ' .
          'class="wysiwyg-sp-seo-img" >',
        'suffix' => '</span>',
      ),
      'metatag_markup' => array(
        'prefix' => '<!--smartpagingmeta ',
        'suffix' => '-->',
      ),
    ),
  );
  return $plugins;
}
