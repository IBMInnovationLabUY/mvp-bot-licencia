// document.querySelector('#record').onclick = function () {
//   document.getElementById("textInput").focus();
//   var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
//     token: Api.getCredentials().token,
//     model: 'es-ES_BroadbandModel',
//     outputElement: '#textInput' // CSS selector or DOM Element
//   });

//   stream.on('error', function(err) {
//     console.log(err);
//     if (event.keyCode === 13){
//       stream.stop();
//     }
//   })

//   document.querySelector('#off').onclick = function() {
//     document.getElementById("textInput").focus();
//     stream.stop();
//   };
// };

// ------

var Speech = (function () {
  var stream = null;

  return {
    startRecording: startRecording,
    stopRecording: stopRecording
  };

  function startRecording() {
    document.getElementById("textInput").focus();
    stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
      token: Api.getCredentials().token,
      model: 'es-ES_BroadbandModel',
      outputElement: '#textInput'
    });

    stream.on('error', function(err) {
      console.log(err);
    })
  }

  function stopRecording() {
    document.getElementById("textInput").focus();
    if (stream){
      stream.stop();
    }
  }

}())
