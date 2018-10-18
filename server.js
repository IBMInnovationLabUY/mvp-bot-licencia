#!/usr/bin/env
/**
 * Copyright 2018 DIEGO VERDIER. All Rights Reserved.
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

require('dotenv').config({silent: true});

var cfenv   = require('cfenv');
var appEnv = cfenv.getAppEnv();

var db = require('./db');
var uri = 'mongodb+srv://dverdier:9cUEGQRcwrrH2jJ@cluster0-sbwe9.mongodb.net/test?retryWrites=true';
var server = require('./app')

db.connect(uri, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    server.listen(appEnv.port, appEnv.bind, function() {
      // eslint-disable-next-line
      console.log('Server running on port: %d', appEnv.port);
    });
  }
})
