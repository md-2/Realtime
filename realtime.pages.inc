<?php

/**
 * Admin form.
 */
function realtime_admin_auth_form() {
  $form = array();

  $form['realtime_client_id'] = array(
    '#title' => t('Client ID'),
    '#type' => 'textfield',
    '#default_value' => variable_get('realtime_client_id'),
  );

  $form['realtime_client_secret'] = array(
    '#title' => t('Client Secret'),
    '#type' => 'textfield',
    '#default_value' => variable_get('realtime_client_secret'),
  );

  $form['realtime_redirect_uri'] = array(
    '#title' => t('Redirect URI'),
    '#type' => 'textfield',
    '#default_value' => variable_get('realtime_redirect_uri'),
  );

  return system_settings_form($form);
}

/**
 * Page callback for the 'goauth/authenticate' path.
 *
 * This page callback does every kind of authorizations.
 */
function realtime_authenticate_page() {
    
  $client = new RealtimeAuthHandler(
    variable_get('realtime_client_id'),
    variable_get('realtime_client_secret'),
    variable_get('realtime_redirect_uri')
  );

  $authUrl = $client->getAuthorizationUrl();
  drupal_goto($authUrl);
}

function realtime_thankyou_page() {
  global $user;
  $code = $_GET['code'];
  
  $client = new RealtimeAuthHandler(
    variable_get('realtime_client_id'),
    variable_get('realtime_client_secret'),
    variable_get('realtime_redirect_uri')
  );
  $client = $client->getClient();
  $client->setAccessType('offline');
  
  if(isset($code)) {
    $client->authenticate($code);
    $token = $client->getAccessToken();
  }
  if (isset($token)) {    
    //json decode the session token and save it in a variable as object
    $sessionToken = json_decode($token);
    variable_set('realtime_access_token',$sessionToken->access_token);
    variable_set('realtime_token_type',$sessionToken->token_type);
    variable_set('realtime_expires_in',$sessionToken->expires_in);
    variable_set('realtime_refresh_token',$sessionToken->refresh_token);
    variable_set('realtime_token_created',$sessionToken->created);
  }
  
  return t('You have successfully authorised Google Realtime API! ') . $user->mail . '<br>' . $code . '<br>' . variable_get('realtime_access_token') . '<br>' . variable_get('realtime_refresh_token') . '<br>';
}