'use strict';

var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');

var url = process.env.SPEECH_URL || '{url}';
var speechToText = new SpeechToText({
  username: process.env.SPEECH_USERNAME || '{username}',
  password: process.env.SPEECH_PASSWORD || '{password}',
  url: url
});

var customization_id = process.env.SPEECH_CUSTOMIZATION_ID || '{customization_id}';

exports.sendResponse = function (req, res) {
  var tokenManager = new AuthorizationV1(speechToText.getCredentials());
  tokenManager.getToken((err, token) => {
    if (err) {
      next(err);
    } else {
      var credentials = {
        token,
        url,
        customization_id
      };
    res.json(credentials);
    }
  });
}
