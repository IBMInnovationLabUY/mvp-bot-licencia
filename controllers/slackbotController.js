require('dotenv').load();

var Botkit = require('botkit');
var express = require('express');
var chatbotController = require('./chatbotController');

var slackController = Botkit.slackbot();
var slackBot = slackController.spawn({
  token: process.env.SLACK_TOKEN
});

var req = {
  body: {
    context: {},
    input: { text: '' }
  },
  slackBot: 'true'
};

var res;

chatbotController.sendResponse(req, function(data){
  if (data){
    res = data;
  }
});

slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  slackController.log('Slack message received');
  req.body.input.text = message.text || {};
  chatbotController.sendResponse(req, function(res){
    if (res){
      bot.reply(message, res.output.text.join('\n'));
      req.body.context = res.context;
    }
  });
});

slackBot.startRTM();
