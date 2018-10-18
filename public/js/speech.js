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

    stream.on('data', function(data) {
      console.log(data);
    })

  }
  function stopRecording() {
    document.getElementById("textInput").focus();
    if (stream){
      stream.stop();
    }
    stream = null;
  }

}())
