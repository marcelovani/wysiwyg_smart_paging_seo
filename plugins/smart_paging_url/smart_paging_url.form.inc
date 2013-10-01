<?php

/**
 * @file
 * Implement Wysiwyg url form.
 */

/**
 * Helper that returns urls form or a custom form.
 */
function wysiwyg_smart_paging_url_form() {
  $form = array();

  // Modify the form.
  $form['#prefix'] = '<div class="wysiwyg-sp-url-popup">' . '<h2>Edit Url</h2>';
  $form['#suffix'] = '</div>';

  $form['url'] = array(
    '#type' => 'textfield',
    '#name' => 'url',
    '#title' => 'Fragment URL',
    '#size' => 60,
    '#description' => t('A Fragment URL specifies a location within a page. i.e. http://example.com/help#main'),
  );

  $form['actions'] = array('#weight' => 100);
  $form['actions']['insert'] = array(
    '#type' => 'button',
    '#value' => t('Insert'),
    '#name' => 'insert',
    '#attributes' => array('class' => array('insert'),
      'onclick' => 'return (false);'),
  );
  $form['actions']['cancel'] = array(
    '#type' => 'button',
    '#value' => t('Cancel'),
    '#name' => 'cancel',
    '#attributes' => array('class' => array('cancel'),
      'onclick' => 'return (false);'),
  );

  // Allow other modules to alter this form.
  drupal_alter('wysiwyg_smart_paging_url_form', $form);

  return $form;
}

/**
 * Implements hook_wysiwyg_smart_paging_url_form_alter().
 */
function wysiwyg_smart_paging_seo_wysiwyg_smart_paging_url_form_alter(&$form) {
  // Alter the form here.
}
