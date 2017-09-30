// 서버를 구동하기 위하여 필요한 모듈을 불러운다

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // express 서버에서 일어나는 request를 콘솔에 출력해줍니다.
const mongoose = require('mongoose');
var cors = require('cors');

// config.js파일에서 설정값들을 가져온다.
const config = require('./config');
const port = process.env.PORT || config.port ;

// express서버를 생성한다.
const app = express();

// cors domain을 사용가능하게 해주는 코드
  

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

// print the request log on console
app.use(morgan('dev'));
app.set('jwt-secret', config.secret);

// index page, just for testing
app.get('/', (req, res) => {
    res.send('Hello JWT')
});

app.use('/api', require('./router/api'));


// open the server
app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
});


/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', ()=>{
    console.log('connected to mongodb server');
}); 