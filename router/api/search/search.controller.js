const https = require('https');
var url = require('url');
const Search = require ('../../../models/search');
var config = require('../../../config');
const endpoint = config.google_map_endpoint;
const api_key = config.google_api_key;

// placelist 서비스 database 내에 있는 데이터를 먼저 조회
exports.basicKeyword = (req, res) =>{
    Search.find({name : req.body.keyword})
    .then(
        console.log(res)
    );
}

exports.keyword = (req, res) => {
    res.send('keword Search');
    console.log(req.body.keyword);
    const keyword = req.body.keyword;
    const path = `/maps/api/place/${config.user_google_place_api.textsearch}/json`;
    const url = `${path}?query=${encodeURIComponent(keyword)}&language=ko&key=${api_key}`;
    const option = {host: endpoint, path: url, port:url.port, method: "GET"};

    //https 모듈을 이용하여 google API와 통신하는 함수
    getGoogleAPI_Data(option, (res)=>{
        console.log(res);
    });
    
}



exports.GoogleDetails = (req, res) => {
    // 구글 디테일 API는 place_id를 전달받아 해당 place 정보를 리턴해주는 API이다.
    const place_id = req.body.place_id;
    const path = `/maps/api/place/${config.user_google_place_api.place_details}/json`;
    const url = `${path}?placeid=${place_id}&language=ko&key=${api_key}`;
    const option = {host: endpoint, path: url, port:url.port, method: "GET"};

    const create_P_data = (place) => {
        let p = new Promise((resolve, reject)=>{
            getGoogleAPI_Data(option, (res)=>{
                let data_obj = res.result;
                G_dataToP_data(data_obj, (res)=>{
                    if(place){
                        resolve(res);
                    } else {
                        Search.create(res);
                    }
                });
            });
        })

        return p;
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

    Search.findOneByPlaceId(place_id)
    .then(create_P_data)
    .then(respond)
    .catch(onError);


}

function G_dataToP_data (data, callback){
    let obj = {
        G_place_id : null,
        name : null,
        formatted_address : null,
        address_components : {
            address : {
                level_1 : null,
                level_2 : null,
                level_3 : null
            }
        },
        location : {
            lat : null,
            lng : null
        },
        formatted_phone_number : null,
        photos: null,
        type : null,
        website : null
    };

    let P_data = Object.assign({}, obj);

    for(key in data){
        if(key === "address_components"){
            address_components_slice(data[key], (res) =>{
                P_data[key] = res;
            });
        } else if(key === "place_id"){
            P_data.G_place_id = data[key];
        } else if (key === "geometry"){
            P_data.location = data[key].location;
        } else {
            for (key2 in P_data){
                if(key === key2){
                    P_data[key2] = data[key];
                }
            }
        }
    }
    callback(P_data);

}


function address_components_slice(data, callback){
    let add = {
		level_1 : null,
		level_2 : null,
		level_3 : null
    };
    let address = Object.assign({}, add);
    for(let i = 0 ; i < data.length ; i++){
        for(let i2 = 0 ; i2 < data[i].types.length ; i2++ ){
            if (data[i].types[i2] === 'administrative_area_level_1'){
                address.level_1 = data[i].long_name;
            } else if (data[i].types[i2] === 'sublocality_level_1'){
                address.level_2 = data[i].long_name;
            } else if(data[i].types[i2] === 'sublocality_level_2'){
                address.level_3 = data[i].long_name;
            }
        }
    }

    callback(address);
}

// 구글 API를 사용하여 특정 데이터를 받아오는 함수
function getGoogleAPI_Data (option, callback) {
    console.log("함수실행");
    https.request(option, (res) => {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (chunk) {
            result += chunk;
        }).on('end', function () {
            var data = JSON.parse(result);
            callback(data);
        });
    }).end();
}


// 다음버전에...
exports.autoKeyword = (req, res) => {
    res.send('Auto Keyword');
}