const User = require('../../../models/user');
const config = require('../../../config');
const jwt = require('jsonwebtoken');

exports.addList = (req, res) => {
    let addList = req.body.addList;
    User.addPlaceList(addList.userId, addList.placeDetail)
        .then((data) => {
            res.status(200).json(data);
        });
};

exports.getList = (req, res) => {
    const token = req.headers['x-access-token'] || req.query.token;
    let userEmail = jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err);
        return decoded.userEmail;
    });
    console.log("params : ", req.params);
    User.find({ userEmail: userEmail }, { placeList: 1 })
        .then((data) => {
            res.status(200).json(data);
        });
};

exports.getFillterList = (req, res) => {
    const token = req.headers['x-access-token'] || req.query.token;
    let userEmail = jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err);
        return decoded.userEmail;
    });
    User.find({ userEmail: userEmail }, { placeList: 1 })
        .then((data) => {
            console.log(data[0].placeList);
            let fillterList = {
                sido: [],
                sigugun: [],
                category: []
            }

            // fillters의 값을 뽑아 fillterList에 push합니다.
            for (var i in data[0].placeList) {
                for (key in data[0].placeList[i].fillters) {
                    console.log("key : ", key);
                    if (data[0].placeList[i].fillters[key] !== "") {
                        fillterList[key].push(data[0].placeList[i].fillters[key]);
                    }
                }
            }

            // 배열의 중복된 값을 제거합니다.
            for (key in fillterList) {
                fillterList[key] = fillterList[key].reduce(function (a, b) {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []);
            }
            res.status(200).json(fillterList);
        });
}

exports.removeList = (req, res) => {
    const token = req.headers['x-access-token'] || req.query.token;
    let userEmail = jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err);
        return decoded.userEmail;
    });
    let placeId = req.body.placeId;
    User.removePlaceList(userEmail, placeId)
        .then((data) => {
            res.status(200).json(data);
        });
};