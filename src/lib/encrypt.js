/*jshint esversion: 6 */
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

var fs = require('fs');
var zlib = require('zlib');
var path = require("path");

export default function(file, password, callback, isDecrypt){
  function decode(d_file, onend){
    console.log(d_file);
    var decrypt = crypto.createDecipher(algorithm, password);
    var unzip = zlib.createGunzip();
    var dirname = path.dirname(d_file);
    var r = fs.createReadStream(d_file);
    var w = fs.createWriteStream(d_file + ".decrypted");
    r.pipe(decrypt).pipe(unzip).pipe(w);
    r.on("end", onend);
  }

  function encode(){
    var zip = zlib.createGzip();
    var encrypt = crypto.createCipher(algorithm, password);
    var dirname = path.dirname(file);
    var r = fs.createReadStream(file);
    var e_file = file + ".encrypted";
    var w = fs.createWriteStream(e_file);
    r.pipe(zip).pipe(encrypt).pipe(w);

    r.on('end', () => {
      decode(e_file, () => {
        var r_test = fs.createReadStream(file);
        var hash = crypto.createHash('sha1');
        r_test.pipe(hash);
        r_test.on('end', () => {
          hash.end();
          var e_file_decode = e_file + ".decrypted";
          var r_test_test = fs.createReadStream(e_file_decode);
          var hash_test = crypto.createHash('sha1');
          r_test_test.pipe(hash_test);
          r_test_test.on('end', () =>{
            hash_test.end();
            // if the hashes match then delete original and .encrypted.decrypted
            if(JSON.stringify(hash.read()) == JSON.stringify(hash_test.read())){
              fs.unlink(e_file_decode);
              fs.unlink(file);
              callback();
            }
          });
        });
      });
    });
  }

  if (isDecrypt){
    decode(file + ".encrypted", () => {
      fs.rename(file + ".encrypted" + ".decrypted", file, (err) => {
        if (err)
          console.log(err);
        else
          callback();
      });
    });
  } else {
    encode();
  }
}
