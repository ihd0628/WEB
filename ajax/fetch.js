function fetchPage(name) {
    fetch(name).then(function (response) {
        response.text().then(function (text) {
            document.querySelector('article').innerHTML = text;        
        })
    });
}

if (location.hash) {
    fetchPage(location.hash.substr(2));
    console.log(location.hash.substr(2)); 
} else {
    fetchPage('welcome');
}    

fetch('list').then(function (response) {
    response.text().then(function (text) {
        //<li><a href="#!html" onclick="fetchPage('html')"> HTML</a></li>
        const items = text.split(",");
        console.log(items); 
        let i = 0;
        let tags = "";
        while(i<items.length){
            // tag = `<li>${items[i]}</li>`
            let item = items[i];
            item = item.trim(); // trim은 앞뒤 줄바꿈이나 간격을 제거허는 메소드
            console.log(item);
            let tag = `<li><a href="#!${item}" onclick="fetchPage('${item}')"> ${item}</a></li>` 
            tags = tags + tag;
            console.log(tag);
            i++;
        }
        document.querySelector('#nav').innerHTML = tags;        
    })
});
