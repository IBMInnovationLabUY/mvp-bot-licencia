// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';
  var speechEndpoint = '/api/speech'
  // var waiting = false;

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,
    sendSpeech: sendSpeech,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    },
    getCredentials: function() {
      return credentials;
    },
    setCredentials: function(newCredentials) {
      credentials = JSON.parse(newCredentials)
    }
    // ,
    // getWaiting: function() {
    //   return waiting;
    // },
    // setWaiting: function(newWaitingvalue) {
    //   responsePayload = newWaitingvalue;
    // }
  };

  function sendRequest(text, context) {
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    // Api.setWaiting(true);
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
        // Api.setWaiting(false);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }
    // Send request
    http.send(params);
  }

  function sendSpeech(text, context) {
    // Built http request
    var http = new XMLHttpRequest();
    http.open('GET', speechEndpoint, true);
    // http.setRequestHeader('Content-type', 'application/json');
    // Api.setWaiting(true);
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setCredentials(http.responseText);
      }
    };
    // Send request
    http.send("");
  }


}());
