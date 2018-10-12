var model = 'es-ES_BroadbandModel';
var rawMessages = [];
var formattedMessages = [];
var audioSource = null;
var speakerLabels = true;
var keywords = false;
var settingsAtStreamStart = {
    model: 'es-ES_BroadbandModel',
    keywords: [],
    speakerLabels: false,
  };
var error = null;
var stream = null;

var SpeechToText = (function () {

  return {
    record: record
  };

  function handleMicClick() {
    if (audioSource === 'mic') {
      stopTranscription();
      return;
    }
    reset();
    audioSource = 'mic';

    handleStream(recognizeMicrophone(getRecognizeOptions()));
  }

  function reset() {
    if (audioSource) {
      stopTranscription();
    }
    rawMessages = []
    formattedMessages = []
    error = null;
  }

  function stopTranscription() {
    if (stream) {
      stream.stop();
      // this.stream.removeAllListeners();
      // this.stream.recognizeStream.removeAllListeners();
    }
    audioSource = null;
  }

  function record(event) {
    handleMicClick()
    // Submit on enter key, dis-allowing blank messages
    console.log(stream)
    sendMessage(inputBox.value);
    // Clear input box for further messages
    inputBox.value = '';
    Common.fireEvent(inputBox, 'input');
  }

  function handleStream(streamHandle) {
    console.log(streamHandle);

    if (stream) {
      stream.stop();
      stream.removeAllListeners();
      stream.recognizeStream.removeAllListeners();
    }
    stream = streamHandle;
    captureSettings();

    streamHandle.on('data', handleFormattedMessage).on('end', handleTranscriptEnd).on('error', handleError);

    streamHandle.recognizeStream.on('end', () => {
      if (error) {
        handleTranscriptEnd();
      }
    });

    streamHandle.recognizeStream
      .on('message', (frame, json) => handleRawMessage({ sent: false, frame, json }))
      .on('send-json', json => handleRawMessage({ sent: true, json }))
      .once('send-data', () => handleRawMessage({
        sent: true, binary: true, data: true, // discard the binary data to avoid waisting memory
      }))
      .on('close', (code, message) => handleRawMessage({ close: true, code, message }));

  }

  function captureSettings() {
    settingsAtStreamStart = {
      model,
      keywords: getKeywordsArrUnique(),
      speakerLabels,
    }
  }

  function handleFormattedMessage(msg) {
    formattedMessages = formattedMessages.concat(msg);
  }

  function handleTranscriptEnd() {
    audioSource = null;
  }

  function handleRawMessage(msg) {
    rawMessages = rawMessages.concat(msg);
  }

  function getKeywordsArrUnique() {
    return keywords
      .split(',')
      .map(k => k.trim())
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  function getRecognizeOptions(extra) {
    const keywords = getKeywordsArrUnique();
    return Object.assign({
      token: Api.getCredentials.token,
      smart_formatting: true,
      format: true, // adds capitals, periods, and a few other things (client-side)
      model: model,
      objectMode: true,
      interim_results: true,
      word_alternatives_threshold: 0.01,
      keywords,
      keywords_threshold: keywords.length
        ? 0.01
        : undefined, // note: in normal usage, you'd probably set this a bit higher
      timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
      speaker_labels: speakerLabels,
      resultsBySpeaker: speakerLabels,
      speakerlessInterim: speakerLabels,
      url: Api.getCredentials.serviceurl,
    }, extra);
  }

}());
