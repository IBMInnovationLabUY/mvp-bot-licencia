'use strict';
require('dotenv').config({ silent: true }); // optional, handy for local development
var recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');
var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
var WebSocket = require('websocket').client;
const AuthorizationV1 = require('watson-developer-cloud/authorization/v1');
// var LineIn = require('line-in'); // the `mic` package also works - it's more flexible but requires a bit more setup
// var wav = require('wav');

const serviceUrl = process.env.SPEECH_URL || 'https://stream.watsonplatform.net/speech-to-text/api';

var speechToText = new SpeechToText({
  username: '78d5a6c0-3a43-4cc7-8abd-7c915b62b578' || '{username}',
  password: 'CretOpZGjJGb' || '{password}',
  url: serviceUrl
});

exports.sendResponse = function (req, res) {
  var tokenManager = new AuthorizationV1(speechToText.getCredentials());
  tokenManager.getToken((err, token) => {
    if (err) {
      next(err);
    } else {
      var credentials = {
        token,
        serviceUrl,
      };
    res.json(credentials);
    }
  });
}


// var model = 'es-ES_BroadbandModel';
// var wsURI = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize'
//   + '?watson-token=' + token
//   + '&model=' + model;
// var websocket = new WebSocket(wsURI);
// websocket.onopen = function(evt) { onOpen(evt) };
// websocket.onclose = function(evt) { onClose(evt) };
// websocket.onmessage = function(evt) { onMessage(evt) };
// websocket.onerror = function(evt) { onError(evt) };

// function onOpen(evt) {
//   var message = {
//     'action': 'start',
//     'content-type': 'audio/l16;rate=22050'
//   };
//   websocket.send(JSON.stringify(message));
// }

// var lineIn = new LineIn(); // 2-channel 16-bit little-endian signed integer pcm encoded audio @ 44100 Hz

// var wavStream = new wav.Writer({
//   sampleRate: 44100,
//   channels: 2,
// });

// var recognizeStream = speechToText.createRecognizeStream({
//   content_type: 'audio/wav',
//   interim_results: true,
//   model: 'es-ES_BroadbandModel'
// })
// console.log(typeof window);
// lineIn.pipe(wavStream);

// wavStream.pipe(recognizeStream);

// exports.sendResponse = function (req, res) {
//   console.log(typeof window)
// }

// recognizeStream.pipe(process.stdout);
