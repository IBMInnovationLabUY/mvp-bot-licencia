'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LicencesSchema = new Schema({
  name: {
    type: String,
    required: 'Nombre de la persona solicitante de la licencia'
  },
  document_id: {
    type: String,
    required: 'Documento de identidad de la persona solicitante de la licencia'
  },
  start_date: {
    type: Date,
    required: 'Fecha de inicio de la licencia'
  },
  end_date: {
    type: Date,
    required: 'Fecha de retorno de la licencia'
  },
  confirmation_code: {
    type: Number,
    required: 'Codigo de confirmacion de la solicitud de licencia'
  }
});

module.exports = mongoose.model('Licences', LicencesSchema);
