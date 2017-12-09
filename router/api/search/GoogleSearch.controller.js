const https = require('https');
var url = require('url');
const Search = require('../../../models/search');
var config = require('../../../config');
const endpoint = config.google_map_endpoint;
const api_key = config.google_api_key;

// google search api
exports.keyword = (req, res) => {
    console.log(req.body.keyword);
    const keyword = req.body.keyword;
    const path = `/maps/api/place/${config.user_google_place_api.textsearch}/json`;
    const url = `${path}?query=${encodeURIComponent(keyword)}&language=ko&key=${api_key}`;
    const option = { host: endpoint, path: url, port: url.port, method: "GET" };

    //https 모듈을 이용하여 google API와 통신하는 함수
    getGoogleAPI_Data(option).then((data) => {
        res.status(200).json(data);
        console.log(data);
    }, (err) => {
        console.log("err : ", err);
    }).catch((error) => {
        res.status(409).json({
            message: error.message
        })
    });

}



exports.Details = (req, res) => {
    // 구글 디테일 API는 place_id를 전달받아 해당 place 정보를 리턴해주는 API이다.
    const place_id = req.body.place_id;
    const G_place_id = req.body.G_place_id;
    const path = `/maps/api/place/${config.user_google_place_api.place_details}/json`;
    const url = `${path}?placeid=${G_place_id}&language=ko&key=${api_key}`;
    const option = { host: endpoint, path: url, port: url.port, method: "GET" };
    if (place_id === null) {

    } else {
        Search.findOneByPlaceId(place_id)
            .then(create_P_data)
            .catch(onError);
    }

    const create_P_data = (place) => {
        getGoogleAPI_Data(option)
            .then((res) => {
                let data_obj = res.result;
                return data_obj;
            })
            .then(G_dataToP_data)
            .then((res) => {
                if (place) {
                    return res;
                } else {
                    Search.create(res);
                }
            })
            .then(respond);
    };

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    };

    const respond = (data) => {
        console.log(data);
        res.status(200).json(data);
    };
}


//구글 place details data를 placelist database에 맞게 변환하는 함수
const G_dataToP_data = function (data) {
    return new Promise((resolve, reject) => {
        if (typeof data !== "object") {
            reject("Delivery data is not an object");
        } else {
            let obj = {
                G_place_id: null,
                name: null,
                formatted_address: null,
                address_components: {
                    address: {
                        level_1: null,
                        level_2: null,
                        level_3: null
                    }
                },
                location: {
                    lat: null,
                    lng: null
                },
                formatted_phone_number: null,
                photos: null,
                type: null,
                website: null
            };

            let P_data = Object.assign({}, obj);

            for (key in data) {
                if (key === "address_components") {
                    address_components_slice(data[key], (res) => {
                        P_data[key] = res;
                    });
                } else if (key === "place_id") {
                    P_data.G_place_id = data[key];
                } else if (key === "geometry") {
                    P_data.location = data[key].location;
                } else {
                    for (key2 in P_data) {
                        if (key === key2) {
                            P_data[key2] = data[key];
                        }
                    }
                }
            }
            resolve(P_data);
        }
    });
};

//구글 place details data에서 지역객체의 data를 place database에 맞게 변환하는 함수
const address_components_slice = function (data) {
    return new Promise((resolve, reject) => {
        let add = {
            level_1: null,
            level_2: null,
            level_3: null
        };
        if (typeof data !== "object") {
            reject("Delivery data is not an object");
        } else if (!('types' in data)) {
            reject("The forwarding data format is incorrect");
        } else {
            let address = Object.assign({}, add);
            for (let i = 0; i < data.length; i++) {
                for (let i2 = 0; i2 < data[i].types.length; i2++) {
                    if (data[i].types[i2] === 'administrative_area_level_1') {
                        address.level_1 = data[i].long_name;
                    } else if (data[i].types[i2] === 'sublocality_level_1') {
                        address.level_2 = data[i].long_name;
                    } else if (data[i].types[i2] === 'sublocality_level_2') {
                        address.level_3 = data[i].long_name;
                    }
                }
            }
            resolve(address);
        }
    });
};

// 구글 API를 사용하여 특정 데이터를 받아오는 함수
const getGoogleAPI_Data = function (option) {
    return new Promise((resolve, reject) => {
        console.log("함수실행");
        if ('host' in option && 'port' in option && 'path' in option && 'method' in option) {
            https.request(option, (res) => {
                res.setEncoding('utf8');
                var result = '';
                res.on('data', function (chunk) {
                    result += chunk;
                }).on('end', function () {
                    console.log(result);
                    var data = JSON.parse(result);
                    if (data.status !== 'OK') {
                        reject("google API ERROR : " + data.status);
                    }
                    resolve(data);
                });
            }).end();
        } else {
            reject("The configuration of the option is invalid.");
        }
    });
};