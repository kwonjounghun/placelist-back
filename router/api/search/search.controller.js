const https = require('https');
var url = require('url');
const Search = require('../../../models/search');
var config = require('../../../config');
const endpoint = config.google_map_endpoint;
const api_key = config.google_api_key;

// placelist 서비스 database 내에 있는 데이터를 먼저 조회
exports.basicKeyword = (req, res) => {
    console.log("들어온다!");
    Search.findPlace(req.body.keyword)
        .then((data) => {
            res.status(200).json(data);
        });
}

exports.Details = (req, res) => {
    console.log(req.body.place_id);
    Search.findPlaceDetail(req.body.place_id)
        .then((data) => {
            res.status(200).json(data);
        }).catch(
            (error)=>{
                res.status(409).json(error);
            }
        );
}







// 다음버전에...
exports.autoKeyword = (req, res) => {
    res.send('Auto Keyword');
}