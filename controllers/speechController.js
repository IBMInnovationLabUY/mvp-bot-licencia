'use strict';

var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');

// const cfenv = require("cfenv");

// var db = require('../db');
// var vcapLocal;
// try {
//   vcapLocal = require('../vcap/speech2text-licences_vcap.json');
// } catch (e) {
//   console.log("error: ", e);
// }

// const appEnvOpts = vcapLocal ? { vcap: vcapLocal }: {}
// const appEnv = cfenv.getAppEnv(appEnvOpts);

// var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
// const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');

// var AssistantV1 = require('watson-developer-cloud/assistant/v1');
// var assistant = new AssistantV1({
//   version: '2018-07-10',
//   username: appEnv.VCAP_SERVICES.speech_to_text[0].credentials.username,
//   password: appEnv.VCAP_SERVICES.speech_to_text[0].credentials.password,
//   url: appEnv.VCAP_SERVICES.speech_to_text[0].credentials.url
// });


var url = process.env.SPEECH_URL || '{url}';
var speechToText = new SpeechToText({
  username: process.env.SPEECH_USERNAME || '{username}',
  password: process.env.SPEECH_PASSWORD || '{password}',
  url: url
});


exports.sendResponse = function (req, res) {
  var tokenManager = new AuthorizationV1(speechToText.getCredentials());
  tokenManager.getToken((err, token) => {
    if (err) {
      next(err);
    } else {
      var credentials = {
        token,
        url,
      };
    res.json(credentials);
    }
  });
}
