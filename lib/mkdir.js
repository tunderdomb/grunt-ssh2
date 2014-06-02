var path = require("path")
module.exports = function mkdir( sftp, p, done ){
  sftp.mkdir(p, function ( err ){
    if ( !err ) {
      done(null)
    }
    else switch ( err.type ) {
      case "NO_SUCH_FILE":
        mkdir(sftp, path.dirname(p), function ( er ){
          if ( er ) done(er)
          else mkdir(sftp, p, done)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        sftp.stat(p, function ( er2, stat ){
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if ( er2 || !stat.isDirectory() ) done(err)
          else done(null)
        });
        break;
    }
  })
}