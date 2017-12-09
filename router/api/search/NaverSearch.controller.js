const https = require('https');
var url = require('url');
const Search = require('../../../models/search');
var config = require('../../../config');

exports.NaverKeyword = (req, res) => {
    console.log("들어온다!");
    let keyword = req.body.keyword;
    let display = 100;
    let start = 1;
    let api_url = `${config.naver_search.local}?query=${encodeURIComponent(keyword)}&display=${display}`;
    if (start in req.body) {
        start = req.body.start;
        api_url = `${config.naver_search.local}?query=${encodeURIComponent(keyword)}&display=${display}&start=${start}`;
    }
    console.log(api_url);
    let options = {
        host: config.naver_map_endpoint,
        path: api_url,
        port: url.port,
        method: "GET",
        headers: { 'X-Naver-Client-Id': config.naver.client_id, 'X-Naver-Client-Secret': config.naver.client_secret }
    }
    getPlaceList(options)
        .then((data) => {
            console.log(data.items.length);
            for (let i = 0; i < data.items.length; i++) {
                for (key in data.items[i]) {
                    if (key === "title") {
                        data.items[i]["title"] = data.items[i]["title"].replace("<b>", "").replace("</b>", "");
                    }
                    if (key === "category"){
                        let firstCategory = data.items[i][key].split(">");
                        firstCategory = firstCategory[0];
                        data.items[i].fillter = firstCategory;
                    }
                }
            }

            res.status(200).json(data.items);
        })
        .catch((error) => {
            console.log("error", error);
        });
}

exports.NaverDetail = (req, res) => {
    let placeInfo = req.body.PlaceInfo;
    console.log(placeInfo);
    let address = placeInfo.address;
    let addrItems;
    let api_url = `${config.naver_map.get_geocode}?query=${encodeURIComponent(address)}`;
    let options = {
        host: config.naver_map_endpoint,
        path: api_url,
        port: url.port,
        method: "GET",
        headers: { 'X-Naver-Client-Id': config.naver.client_id, 'X-Naver-Client-Secret': config.naver.client_secret }
    };

    const createDetail = (obj) => {
        Search.create
    }
    const findOnlyPlaceCount = () => {
        return Search.count().where({
            address: address
        }).where({ name: new RegExp(placeInfo.title, 'g') }).exec();
    }
    const assign = (count) => {
        console.log("몇개일까? : ", count);
        if (count === 0) {
            return Search.createPlace(placeInfo, addrItems);
        } else if (count === 1) {
            return Search.updatePlace(placeInfo, addrItems);
        }
    };
    const respond = (data) => {
        res.status(200).json(data._id);
    };
    const isAddress = (data) => {
        let obj = JSON.parse(data);

        if (obj.hasOwnProperty("errorCode")) {
            // console.log("주소 : ", obj.result.items[0]);
            console.log("주소를 찾을 수 없다.");
            return getPlaceInfoGoogle(placeInfo.title)
                .then((data) => {
                    console.log("googleData : ", data);
                    let addressData = address.split(" ");
                    console.log("addressData: ", addressData);
                    let changeData = {
                        addrdetail: {
                            "country": "대한민국",
                            "sido": "",
                            "sigugun": "",
                            "dongmyun": "",
                            "ri": "",
                            "rest": ""
                        },
                        point: {
                            x: data.results[0].geometry.location.lng,
                            y: data.results[0].geometry.location.lat
                        }
                    }

                    for (var i in addressData) {
                        let NumberI = Number(i);
                        if (NumberI === 0 && addressData[NumberI].charAt(addressData[NumberI].length - 1) === "시" || addressData[NumberI].charAt(addressData[NumberI].length - 1) === "도") {
                            changeData.addrdetail.sido = addressData[NumberI]
                        } else if (NumberI > 0 && addressData[NumberI].charAt(addressData[NumberI].length - 1) === "시" || addressData[NumberI].charAt(addressData[NumberI].length - 1) === "구" || addressData[NumberI].charAt(addressData[NumberI].length - 1) === "군") {
                            changeData.addrdetail.sigugun = addressData[NumberI]
                        } else if (NumberI > 0 && addressData[NumberI].charAt(addressData[NumberI].length - 1) === "동" || addressData[NumberI].charAt(addressData[NumberI].length - 1) === "읍" || addressData[NumberI].charAt(addressData[NumberI].length - 1) === "면") {
                            changeData.addrdetail.dongmyun = addressData[NumberI]
                        } else if (NumberI > 0 && addressData[NumberI].charAt(addressData[NumberI].length - 1) === "리") {
                            changeData.addrdetail.ri = addressData[NumberI]
                        } else if (NumberI === addressData.length - 1 && /[*0-9-]/.test(addressData[NumberI])) {
                            changeData.addrdetail.rest = addressData[NumberI]
                        }
                    }
                    addrItems = changeData;
                    console.log("1", addrItems);
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            addrItems = obj.result.items[0];
        }

    }

    getPlacepoition(options)
        .then(isAddress)
        .then(findOnlyPlaceCount)
        .then(assign)
        .then(respond)
        .catch(
        (error) => {
            console.log(error);
        }
        )
}

const getPlaceList = (option) => {
    return new Promise((resolve, reject) => {
        https.request(option, (res) => {
            res.setEncoding('utf8');
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            }).on('end', function () {
                console.log(result);
                let data = JSON.parse(result);
                resolve(data);
            });
        }).end();
    })
};

const getPlacepoition = (option) => {
    return new Promise((resolve, reject) => {
        https.request(option, (res) => {
            res.setEncoding('utf8');
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            }).on('end', function () {
                console.log(result);

                resolve(result);
            });
        }).end();
    })

};

const getPlaceInfoGoogle = (title) => {
    const path = `/maps/api/place/${config.user_google_place_api.textsearch}/json`;
    const url = `${path}?query=${encodeURIComponent(title)}&language=ko&key=${config.google_api_key}`;
    const option = { host: config.google_map_endpoint, path: url, port: url.port, method: "GET" };

    return new Promise((resolve, reject) => {
        https.request(option, (res) => {
            res.setEncoding('utf8');
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            }).on('end', function () {
                var data = JSON.parse(result);
                if (data.status !== 'OK') {
                    reject("google API ERROR : " + data.status);
                }
                resolve(data);
            });
        }).end();
    });
}