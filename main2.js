const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');
const templete = require('./lib/templete.js');

let app = http.createServer(function (request, response) {
    let _url = request.url;
    console.log('url: ',_url);
    let queryData = url.parse(_url,true).query;
    let pathname = url.parse(_url,true).pathname;
    console.log('pathname : ', pathname);
    console.log('queryData.id : ', queryData.id);
    
    if (pathname === "/") {
        if (queryData.id === undefined) {
            // title = "welcome";
            // list = "fakeList";
            // control = "fakeControl"
            // body = `<h2>Welcome</h2>Hello, Node.js`;
            // html = templete.HTML(title, list, body, control)

            fs.readdir('./data',(err,filelist) => {       
                title = "Welcome";
                body = `<h2>Welcome</h2>Hello, Node.js`;
                list = templete.List(filelist);
                control = `<a href="create">create</a>`;

                html = templete.HTML(title, list, body, control)
    
                response.writeHead(200);
                response.end(html)
            })
        } else {
            fs.readdir('./data',(err,filelist) =>{
                

                fs.readFile(`./data/${queryData.id}`, 'utf8',(err,description)=>{
                console.log('readfileData : ',description);
                    let title = queryData.id;
                    let list = templete.List(filelist);
                    let body = `<h2>${title}</h2>${description}`;
                    let control = `<a href='update?id=${title}'>Udpate</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>
                    `;

                    console.log('body : ', body);

                    html = templete.HTML(title, list, body, control)

                    response.writeHead(200);
                    response.end(html)   
                })
            })
        }
        
    } else if(pathname === "/create") {
        fs.readdir('./data',(err,filelist) => {       
            title = queryData.id;
            list = templete.List(filelist);
            control = ``;
            body = `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <input type="submit">
            </form>
            `;
            
            html = templete.HTML(title, list, body, control)

            response.writeHead(200);
            response.end(html);
        })
    } else if(pathname === "/create_process") {
            let body = "";
            
            request.on('data', (data) => {
                body = body + data;
                console.log('create precoess : ', body);
            });

            request.on("end", () => {
                let post = qs.parse(body);
                console.log('post : ', post);
                let title = post.title;
                let description = post.description;

                fs.writeFile(`./data/${title}`,description,'utf8',()=>{});
                response.writeHead(302, {Location:`/?id=${title}`});
                response.end();
            })

    } else if(pathname === "/update") {
        fs.readdir('./data',(err,filelist) => {       
            title = queryData.id;
            console.log('updaTe title : ', title);
            list = templete.List(filelist);
            control = ``;
            body = `
            <form action="/update_process" method="post">

                <input type="hidden" name="titleOrigin" value='${title}'>
                <p><input type="text" name="titleToChange" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <input type="submit">
            </form>
            `;
            
            html = templete.HTML(title, list, body, control)
            response.writeHead(200);
            response.end(html);
        })
    
    } else if(pathname === "/update_process") {
        let body = "";
            
            request.on('data', (data) => {
                body = body + data;
                console.log('update precoess : ', body);
            });

            request.on("end", () => {
                let post = qs.parse(body);
                console.log('post : ', post);
                let titleOrigin = post.titleOrigin;
                let title = post.titleToChange;
                let description = post.description;

                fs.rename(`./data/${titleOrigin}`, `./data/${title}`, (err)=>{});
                fs.writeFile(`./data/${title}`,description,'utf8',()=>{});
                response.writeHead(302, {Location:`/?id=${title}`});
                response.end();
            })            
    } else if(pathname === "/delete_process") {
        let body = "";
        request.on('data', (data)=>{
            body = body + data;
        });
        request.on('end',()=>{
            let post = qs.parse(body);
            let id = post.id;
            console.log('delete id: ', id);
            fs.unlink(`./data/${id}`,(err)=>{
                response.writeHead(302, {Location:'/'});
                response.end(); 
            })
        })             
    } else {
            response.writeHead(404);
            response.end("Not found")   
    }
});

app.listen(2000);