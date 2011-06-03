#!/usr/bin/env coffee

process.addListener 'uncaughtException', (err, stack) ->
  console.log '------------------------------'
  console.log "Exception: #{err}"
  console.log err.stack
  console.log '------------------------------'

FortuneGenerator = require './lib/fortune_generator'
Publisher = require './lib/publisher'

generator = new FortuneGenerator 'publish_mode'  # not web mode

new Publisher({
    requestURL:     'http://api.t.sina.com.cn/oauth/request_token'
  , accessURL:      'http://api.t.sina.com.cn/oauth/access_token'
  , consumerKey:    '876399518'
  , consumerSecret: '5c566f066110b736655247490aebab5a'
  , accessToken:    '[TODO: INPUT ACCESSTOKEN]'
  , accessSecret:   '[TODO: INPUT ACCESSSECRET]'
  , publishURL:     'http://api.t.sina.com.cn/statuses/update.json'
  , generator:      generator
})


# TODO add twitter publisher



generator.generate()