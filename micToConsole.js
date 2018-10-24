'use strict';
require('dotenv').config({ silent: true }); // optional, handy for local development

var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
var LineIn = require('line-in'); // the `mic` package also works - it's more flexible but requires a bit more setup
var wav = require('wav');

var url = process.env.SPEECH_URL || '{url}';
var speechToText = new SpeechToText({
  username: process.env.SPEECH_USERNAME || '{username}',
  password: process.env.SPEECH_PASSWORD || '{password}',
  url: url
});
var lineIn = new LineIn(); // 2-channel 16-bit little-endian signed integer pcm encoded audio @ 44100 Hz

var wavStream = new wav.Writer({
  sampleRate: 44100,
  channels: 2,
});


var recognizeStream = speechToText.createRecognizeStream({
  content_type: 'audio/wav',
  interim_results: true,
  model: 'es-ES_NarrowbandModel',
  customization_id: process.env.SPEECH_CUSTOMIZATION_ID || '{customization_id}'
})

console.log(typeof window);
lineIn.pipe(wavStream);
wavStream.pipe(recognizeStream);

recognizeStream.pipe(process.stdout);
