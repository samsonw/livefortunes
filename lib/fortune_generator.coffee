EventEmitter = require('events').EventEmitter
exec  = require('child_process').exec

class FortuneGenerator extends EventEmitter

  constructor: (@mode = 'web') ->
  
  generate: ->
    exec  '/usr/bin/env fortune',
          (error, stdout, stderr) =>
            console.log "stderr: #{stderr}" if stderr? && stderr isnt ''
            console.log "exec error: #{error}" if error?
            console.log stdout
            return @emit 'new', stdout if @mode is 'web'
            fortune = "[Live Fortunes] #{stdout.trim().replace(/\s/g, ' ')}"
            if fortune.length <= 140
              @emit 'new', fortune
            else
              # try again
              console.log "> 140 chars, try again..."
              @generate()

module.exports = FortuneGenerator