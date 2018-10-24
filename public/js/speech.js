var Speech = (function () {
  var stream = null;

  return {
    startRecording: startRecording,
    stopRecording: stopRecording
  };

  function startRecording() {
    document.getElementById("textInput").focus();
    stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
      url: 'wss://stream.watsonplatform.net/speech-to-text/api',
      token: Api.getCredentials().token,
      model: 'es-ES_NarrowbandModel',
      outputElement: '#textInput',
      customization_id: Api.getCredentials().customization_id
      // acoustic_customization:id :
    });

    stream.on('error', function(err) {
      console.log(err);
    })

    stream.on('data', function(data) {
      console.log(data.results[0].alternatives[0].transcript);
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
