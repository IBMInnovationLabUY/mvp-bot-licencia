/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var fechaInicio;
var fechaFin;

const cfenv = require("cfenv");

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk

var chatbot = require('./controllers/chatbotController');
var speech = require('./controllers/speechController');
var slack = require('./controllers/slackbotController');

var app = express();

app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

var db = require('./db');

app.post('/api/message', chatbot.sendResponse);
app.get('/api/speech', speech.sendResponse);

module.exports = app;
