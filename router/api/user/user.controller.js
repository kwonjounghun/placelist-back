const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const config = require('../../../config')

exports.register = (req, res) => {
    
    const {username, userEmail, password} =  req.body;
    let newUser = null;

    const create = (user) => {
        if(user){
            throw new Error('username existes');
        } else {
            console.log("과연");
            return User.create(username, userEmail, password);
        }
    };

    const count = (user) => {
        console.log("2");
        newUser = user;
        return User.count({}).exec();
    };

    const assign = (count) => {
        console.log("3");
        if(count === 1){
            return newUser.assignAdmin();
        } else {
            return Promise.resolve(false);
        }
    };

    const respond = (isAdmin) => {
        console.log("4");
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        });
    };

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        });
    };

    User.findOneByUsername(userEmail)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

exports.login = (req, res) => {
    console.log(req.body)
    const {userEmail, password} = req.body;
    const secret = config.secret;

    const check = (user) => {
        if(!user){
            throw new Error('login failed');
        } else {
            if(user.verify(password)){
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                        _id: user._id,
                        username: user.username,
                        userEmail: user.userEmail,
                        admin: user.admin
                    },
                    secret,
                    {
                        expiresIn: '7d',
                        issuer: 'placelist.com',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if (err) reject(err);
                        resolve(token);
                    });
                });
                return p
            } else {
                throw new Error('login failed');
            }
        }
    };
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        });
    }

    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    User.findOneByUsername(userEmail)
    .then(check)
    .then(respond)
    .catch(onError)
} 

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}