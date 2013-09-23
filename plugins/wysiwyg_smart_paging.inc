<?php

/**
 * @file
 * Implement Wysiwyg module hooks.
 */

/**
 * Implements hook_wysiwyg_module_plugin().
 */
function wysiwyg_smart_paging_wysiwyg_smart_paging_plugin() {
  $plugins['wysiwyg_smart_paging'] = array(
    'title' => t('Wysiwyg Smart Paging'),
    'vendor url' => 'http://drupal.org/project/wysiwyg_smart_paging',
    'icon title' => t('Add Wysiwyg Smart Paging to content'),
    'css path' => drupal_get_path('module', 'wysiwyg_smart_paging'),
    'css file' => 'wysiwyg_smart_paging.css',
    'settings'   => array(
      'smart_paging_path' => drupal_get_path('module', 'smart_paging'),
      'form_markup' => drupal_render(_wysiwyg_smart_paging_form()),
      'icon_markup' => array(
        'prefix' => '<span class="wysiwyg-sp">',
        'src' => '<img src="' .
          drupal_get_path('module', 'wysiwyg_smart_paging') .
          '/plugins/wysiwyg_smart_paging/images/wysiwyg_smart_paging.png' .
          '" ' . 'alt="" title="Metatags" ' .
          'class="wysiwyg-sp-img" >',
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
