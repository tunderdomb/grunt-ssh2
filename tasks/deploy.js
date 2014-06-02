var fs = require('fs')
var path = require("path")
var async = require("async")

var mkdir = require("../lib/mkdir")

var Connection = require("ssh2")

module.exports = function ( grunt ){

  grunt.registerMultiTask("deploy", "deploy to remote host over ssh", function (){
    var options = this.options({
      host: "",
      port: 22
    })

    if ( options.privateKey ) options.privateKey = fs.readFileSync(options.privateKey)

    var files = this.files

    var c = new Connection({})

    var done = this.async()
    c.on('ready', function (){
      c.sftp(function ( err, sftp ){
        if ( err ) throw err
        async.eachSeries(files, function ( filePair, nextPair ){
          async.eachSeries(filePair.src, function ( src, nextSrc ){
            var remoteSrc = path.join(filePair.orig.dest, src).replace(/\\/g, "/")
            src = path.join(process.cwd(), src)
            var remoteDir = path.dirname(remoteSrc)
            mkdir(sftp, remoteDir, function( err ){
              if ( err ) nextSrc(err)
              else sftp.fastPut(src, remoteSrc, {}, function ( err ){
                console.log("uploaded %s -> %s", src, remoteSrc)
                nextSrc(err)
              })
            })
          }, nextPair)
        }, done)
      })
    })
    c.connect(options)
  })

}