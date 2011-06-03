OAuth = require('oauth').OAuth
exec  = require('child_process').exec

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
    
    @init_oauth_client()
  
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
    
  publish_fortune: ->
    self = @
    exec  '/usr/bin/env fortune',
          (error, stdout, stderr) ->
            console.log "stderr: #{stderr}" if stderr? && stderr isnt ''
            console.log "exec error: #{error}" if error?
            console.log stdout
            fortune = "[Live Fortunes] #{stdout.trim().replace(/\s/g, ' ')}"
            if fortune.length <= 140
              self.publish fortune
            else
              # try again
              console.log "> 140 chars, try again..."
              self.publish_fortune()

module.exports = Publisher
