const fs = require('node:fs');

const https = require('node:https');

const options = {
  hostname: 'www.googleapis.com',
  path: '/books/v1/volumes?q=+isbn:9781581574036',
  method: 'GET',
};
let book;

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);

  res.on('data', (response) => {
    book += response;
  });

  res.on('end', () => {
    console.log(book);
    // let response = JSON.parse(d); ??
    if(!book.items){console.log("no items :( "); return;}

    for (var i = 0; i < book.items.length; i++) {
        var item = book.items[i];
        for (var j = 0; j < item.volumeInfo.industryIdentifiers.length; j++){
          if(item.volumeInfo.industryIdentifiers[j].identifier == "9781581574036"){
            console.log("got it")
            // in production code, item.text should have the HTML entities escaped.
          let content = `${item.volumeInfo.title} ${item.volumeInfo.subtitle}, ${item.volumeInfo.authors[0]}, ${item.volumeInfo.description}`;
          }

          fs.appendFile('/Users/glaistig/fun-codez/isbnoutput.txt', content, err => {
            if (err) {
              console.error('Write error: ', err);
            } else {
              console.log('Write success 🕺')
            }
          });
          console.log("i ", i, " id ", item.volumeInfo.industryIdentifiers[j].identifier)
        }

      }
    });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();