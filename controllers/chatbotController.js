'use strict';


var db = require('../db');

var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk

var assistant = new AssistantV1({
  version: '2018-07-10'
});

var checked = false;
var available_days = 0;
var total = 0;

exports.sendResponse = function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  assistant.message(payload, function (err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

    var output = data.output;
    if (output.text.length === 0 && output.hasOwnProperty('generic')) {
      var generic = output.generic;

      if (Array.isArray(generic)) {
        for(var i = 0; i < generic.length; i++) {
          if (generic[i].hasOwnProperty('text')) {
            data.output.text.push(generic[i].text);
          } else if (generic[i].hasOwnProperty('title')) {
            data.output.text.push(generic[i].title);
          }
        }
      }
    }

    if (data.context.cedulaIdentidad && !data.context.solicitudConfirmada){
      var datos = {
        document_id: data.context.cedulaIdentidad
      }

      total = 0;

      if (data.context.startDate && data.context.endDate){

        var fechaInicio = new Date(data.context.startDate);
        var diaInicio = fechaInicio.getDay();
        var inicio = fechaInicio.getTime();
        var fechaFin = new Date(data.context.endDate);
        var diaFin = fechaFin.getDay()
        var fin = fechaFin.getTime();
        var diff = fin - inicio;
        diff = diff/(1000*60*60*24);

        var findes = (diff / 7 >>0)
        var resto = (diff % 7);

        if (diaInicio + resto - 1 > 7){
          findes += 1;
        }

        total = diff - findes*2
      }

      db.find_employee(datos, function(error, resultado){

        if (resultado){
          console.log(resultado);
          console.log(total)
          available_days = resultado;
          if (resultado - total < 0){
            if (resultado == 0 && total >= 0){
              data.output.text = [`Lamentablemente tienes 0 dias diponibles para tomarte licencia`, 'Quieres ingresar otro documento de identidad y continuar con la solicitud?'];
            }else{
              data.output.text = [`Lamentablemente no tienes dias diponibles para tomarte licencia, quieres tomarte ${total} dias y dispones de ${resultado} dias`, 'Quieres realizar otra solicitud?'];
            }
            data.context.startDate = null;
            data.context.endDate = null;
            data.context.sinDias = 'true'
            console.log("Entre");
            data.context.cedulaIdentidad = null;
          }
        }
        var answer = updateMessage(payload, data);
        return res.json(answer);
      })
    }
    else if (data.context.solicitudConfirmada){
      if (data.context.solicitudConfirmada === 'si'){ //GUARDAR EN BASE LA SOLICITUD DE LICENCIA
        var datos = {
          name: data.context.fullName,
          document_id: data.context.cedulaIdentidad,
          start_date: data.context.startDate,
          end_date: data.context.endDate
        }

        db.insert_licence(datos, function(error, resultado){
          if (error) console.log(error)

          let sendText = [`Tu solicitud fue confirmada y se le asigno el codigo ${resultado}`]
          let cant_dias = available_days - total;
          console.log(available_days);
          console.log(total);
          console.log(cant_dias);
          cant_dias = cant_dias.toString()
          console.log(cant_dias);
          var update = {
            document_id: data.context.cedulaIdentidad,
            available_days: cant_dias
          }
          db.update_employee(update);

          data.output.text = sendText

          data.context.sinDias = null;
          data.context.solicitudConfirmada = null;
          data.context.cedulaIdentidad = null;
          data.context.startDate = null;
          data.context.endDate = null;
          data.context.fullName = null;

          var answer = updateMessage(payload, data);
          return res.json(answer);
        });
      }else{
        data.context.sinDias = null;
        data.context.solicitudConfirmada = null;
        data.context.cedulaIdentidad = null;
        data.context.startDate = null;
        data.context.endDate = null;
        data.context.fullName = null;
        var answer = updateMessage(payload, data);
        return res.json(answer);
      }
    }
    else if (data.context.consultarHistorial){
      if (data.context.cedulaConsulta || data.context.confirmationCode){

        if (data.context.cedulaConsulta){
          var datos = {
            document_id: data.context.cedulaConsulta
          }
        }else{
          var datos = {
            _id: data.context.confirmationCode
          }
        }

        db.find_licence(datos, function(error, resultado){
          if (error) console.log(error)

          let message = [`Tienes confirmadas ${resultado.length} licencias: `];
          resultado.forEach(element => {
            let licenceText = `-> Codigo: ${element._id}, a nombre de ${element.name} con documento de identidad ${element.document_id}, para arrancar el ${element.start_date} y terminar el ${element.end_date}`;
            message.push(licenceText);
          });

          data.output.text = message
          var answer = updateMessage(payload, data);
          return res.json(answer);
        });
      }
      data.context.consultarHistorial = null;
      data.context.cedulaConsulta = null;
      data.context.confirmationCode = null;
    }
    else if (data.context.consultarDias){
      if (data.context.cedulaConsulta){
        var datos = {
          document_id: data.context.cedulaConsulta
        }

        db.find_employee(datos, function(error, resultado){

          if (resultado){
            data.output.text = [`Dispones de ${resultado} dias para poder tomarte licencia`];

            data.context.cedulaConsulta = null;
            data.context.consultarDias = null;
            var answer = updateMessage(payload, data);
            return res.json(answer);
          }
        })
      }
    }
    else {
      var answer = updateMessage(payload, data);
      return res.json(answer);
    }
  });
};

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {

  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];

    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}
