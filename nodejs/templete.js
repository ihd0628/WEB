module.exports = {
    HTML: function(title, list, body, control) {
        return`<!doctype html>
        <html> 
        <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>`; 
        },
    List: function(filelist) {
        let tag = '<ul>'
        let li = "";
        let i = 0;

        while (i < filelist.length) {
            li = li + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
        }

        tag = tag + li + `</ul>`;
        return tag;
    }
}







































// var list  = `<ul>`
        // var i = 0;
        // while(i<filelist.length){
        //     list  = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        //     i = i+1;
        // }
        // list = list +`</ul>`;  
        // return list;  