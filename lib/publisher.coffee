OAuth = require('oauth').OAuth

class Publisher
  constructor: (options) ->
    @settings =
      requestURL:         options.requestURL
      accessURL:          options.accessURL
      consumerKey:        options.consumerKey
      consumerSecret:     options.consumerSecret
      accessToken:        options.accessToken
      accessSecret:       options.accessSecret
      version:            options.version ? "1.0A"
      authorizeCallback:  options.authorizeCallback ? null
      signatureMethod:    options.signatureMethod ? "HMAC-SHA1"
      publishURL:         options.publishURL
      generator:          options.generator
    
    @init_generator_listener()
    @init_oauth_client()
  
  init_generator_listener: ->
    @settings.generator.on 'new', (message) =>
      @publish message

  init_oauth_client: ->
    # console.log @settings
    @client = new OAuth @settings.requestURL
                      , @settings.accessURL
                      , @settings.consumerKey
                      , @settings.consumerSecret
                      , @settings.version
                      , @settings.authorizeCallback
                      , @settings.signatureMethod

  
  publish: (message) ->
    @client.post  @settings.publishURL
                , @settings.accessToken
                , @settings.accessSecret
                , { source: @settings.consumerKey, status: message }
                , (error, data) ->
                    if error
                      console.log require('sys').inspect error
                    else
                      console.log data
                      console.log "PUBLISHED: #{message}"

module.exports = Publisher
