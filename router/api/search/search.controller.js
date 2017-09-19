const https = require('https');
var url = require('url');


exports.search = (req, res) => {
    res.send('Hello JWT');
    console.log(req.body);
    const endpoint = 'maps.googleapis.com';
    const path = '/maps/api/place/textsearch/json';
    const api_key = "AIzaSyCwxK5X9VTXnA2MYTGXNtZWhzhAsHGKTdw";

    const url = `${path}?query=${encodeURIComponent(req.body.title)}&key=${api_key}`;
    console.log("url", url);
    https.request({host: endpoint, path: url, port:url.port, method: "GET"}, (res) => {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
			result += chunk;
		}).on('end', function () {
            var data = JSON.parse(result);
            console.log(data.results[3].name);
        });
    }).end();
}