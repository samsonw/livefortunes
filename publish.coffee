#!/usr/bin/env coffee

process.addListener 'uncaughtException', (err, stack) ->
  console.log '------------------------------'
  console.log "Exception: #{err}"
  console.log err.stack
  console.log '------------------------------'

Publisher = require './lib/publisher'

new Publisher({
    requestURL:     'http://api.t.sina.com.cn/oauth/request_token'
  , accessURL:      'http://api.t.sina.com.cn/oauth/access_token'
  , consumerKey:    '[TODO: INPUT CONSUMERKEY]'
  , consumerSecret: '[TODO: INPUT CONSUMERSECRET]'
  , accessToken:    '[TODO: INPUT ACCESSTOKEN]'
  , accessSecret:   '[TODO: INPUT ACCESSSECRET]'
  , publishURL:     'http://api.t.sina.com.cn/statuses/update.json'
}).publish_fortune()


# TODO add twitter publisher

