const express = require('express');
const app = express();
const fs = require('fs');
const port = 4000

const bodyParser = require('body-parser');
const compression = require('compression')
const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')
const helmet = require('helmet');
/*
우리의 웹서버는 웹브라우저로부터 요청이 들어올떄마다 bodyparser미들웨어가 실행되고
compression 미들웨어가 실행되도록 약속이 되어있는겨 

app.use에 함수를 등록하게 되면 그 함수는 미들웨어로서 등록되게 되는것이고
미들웨어의 핵심은 request, response겍체를 받아서 그것을 변형할 수 있다.
그리고 next()를 호출함으로서 그 다음에 실행해야할 미들웨어를 실행할지말지를
그이전 미들웨어가 결정하도록 한다.

또한 경로를 지정해줌으로서 특정 경로에서만 미들웨어가 실행되도록 할수도있고
app.get을통해 get방식에서만 동작하게 할수도 있꼬
인자로 함수를 연속적으로 줌으로서 미들웨어를 여러게 줄수도 있고
ex) app.use('uese/:id',function(req,res,next){}, function(req,res,next){})
*/

app.use(helmet());
app.use(express.static('public'));//<-public 디렉토리안에서 static fIle을 찾겠다는 뜻
//ㅅ 정적인 파일을 서비스하고자 하는 디렉토리를 위에서처럼 지정해주면 돼. 그럼 위에 코드를 통해서 public이라는 디렉토리 아래에있는 파일이나 디렉토리를 url을 통해서 접근 할 수 있게돼.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//아래와같이 app.get을 사용하면 get방식으로 요청했을때만 *는 모든 요청에 대해서 
//즉 get방식으로 들어오는 모든 요청에 대해 파일목록을 가져오는 코드가 되는것이여
//이 2번쨰로 전달돠ㅣ는 콜백함수가 사실은 미들웨어인거지
//EXPRESS에 있는건 거진 다 사실 미들웨어인거지
app.get('*', function (request, response, next) {
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });  
})
app.use('/',indexRouter);
app.use('/topic', topicRouter);

//route, routing 사용자들이 여러 path를 통해서 들어올 때 path마다 적당한 응답을 해주는것.

  
app.use('/topic',topicRouter);

//404에 대한 middleWare를 맨 끝에 위치한 이유는 미들웨어는 순차적으로 실행되기 때문에 더이상 실행하지 못하고 요기 까지 온거면 찾은게 없는 거니까 이렇게 한거제..
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});


//next를 통해 전달받는 err 데이터, +3개의 인자를 가지고 있꼬 그리고 이렇게 4개의 인자를 가지는 함수는 에러를 핸들링하기위한 미들웨어라고 약속이 되어있어, EXPRESS에서는
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
 
/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = u rl.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){ 
      if(queryData.id === undefined){
       } else {
        
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
      
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(4000);
*/
