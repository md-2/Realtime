/**
 * This function is called the first time that the Realtime model is created
 * for a file. This function should be used to initialize any values of the
 * model. In this case, we just create the single string model that will be
 * used to control our text box. The string has a starting value of 'Hello
 * Realtime World!', and is named 'text'.
 * @param model {gapi.drive.realtime.Model} the Realtime root model object.
 */
function initializeModel(model) {
  var string = model.createString(Drupal.settings.realtime.body);
//  var string = gapi.drive.realtime.model.prototype.createString(Drupal.settings.realtime.body);
  model.getRoot().set('body', string);
}

function setPermissions() {
  
}

/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model. In this case, create a text control binder
 * and bind it to our string model that we created in initializeModel.
 * @param doc {gapi.drive.realtime.Document} the Realtime document.
 */
function onFileLoaded(doc) {
  var body = {'value': "",'type': "anyone",'role': "writer"};
  var fileId = rtclient.params.fileId;
  gapi.client.load('drive', 'v2', function() {
    var makepublic = gapi.client.drive.permissions.insert({
     'fileId': fileId,
     'resource': body
    });
    makepublic.execute(function(resp) { });
  });
    
  var string = doc.getModel().getRoot().get('body');

  // Keeping one box updated with a String binder.
  var textArea1 = document.getElementById('edit-body-und-0-value');
  gapi.drive.realtime.databinding.bindString(string, textArea1);
  //console.log(rtclient.params.fileId);
}

/**
 * Options for the Realtime loader.
 */
var realtimeOptions = {
  /**
   * Client ID from the APIs Console.
   */
  clientId: '285812100879.apps.googleusercontent.com',

  /**
   * The ID of the button to click to authorize. Must be a DOM element ID.
   */
  authButtonElementId: 'authorizeButton',

  /**
   * Function to be called when a Realtime model is first created.
   */
  initializeModel: initializeModel,

  /**
   * Autocreate files right after auth automatically.
   */
  autoCreate: true,

  /**
   * Autocreate files right after auth automatically.
   */
   defaultTitle: Drupal.settings.realtime.defaultTitle,

  /**
   * Function to be called every time a Realtime file is loaded.
   */
  onFileLoaded: onFileLoaded,
}


/**
 * Start the Realtime loader with the options.
 */
function startRealtime() {
  var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
  realtimeLoader.start();
}