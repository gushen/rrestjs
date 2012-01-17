var http = require('http'),

  rrest = require('../'),

  server = http.createServer(rrest(function (req, res) {

    res.send('hello world');

})).listen(3000);