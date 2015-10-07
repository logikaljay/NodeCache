var request = require('request');
var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var app = express();

var config = require('./config.json');

app.get('*', function(req, res) {

  // create request to url by combining config.website with req.url
  var url = config.website;
  if (url.indexOf('/', url.length - 1) === -1) {
    url += req.url;
  } else {
    url = url.substr(0, url.length - 1) + req.url;
  }

  // hash our URL
  var hash = crypto.createHash('sha1').update(url).digest('hex');

  fs.exists(path.join('cache', hash), function(exists) {
    if (exists) {
      // get the data from the cache and feed it to the response
      var data = fs.readFileSync(path.join('data', hash + '.json'));
      res.headers = JSON.parse(data);
      console.log(res.headers);
      fs.createReadStream(path.join('cache', hash)).pipe(res);

      console.log('sending "%s" from cache', url);
    } else {
      var options = {
        url: url,
        host: null
      };

      var out = fs.createWriteStream(path.join('cache', hash));

      var input = request(options, function(err, response, body) {
        console.log('requesting "%s" from website and caching as %s', url, hash);
      });

      input.on('response', function(response) {
        response.pipe(out);
        fs.writeFile(path.join('data', hash + '.json'), JSON.stringify(response.headers), 'utf8');
      });
      
      input.pipe(res);
    }
  });
});

app.listen(8080, function(server) {
  var host = 'localhost';
  var port = 8080;

  console.log('NodeCache listening on http://%s:%s', host, port);
});
