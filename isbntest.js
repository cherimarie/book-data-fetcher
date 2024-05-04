const fs = require('node:fs');

const https = require('node:https');

const options = {
  hostname: 'www.googleapis.com',
  path: '/books/v1/volumes?q=+isbn:9781581574036',
  method: 'GET',
};
const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);


  res.on('data', (response) => {

    // Qs: why does this execute 3x, though file is only written to 1x? Why does consolelog show buffer but stdout shows real response data?
    // console.log(response)
    // console.log("--------console ^ ---- stdout >")
    // process.stdout.write(response);
    // let response = JSON.parse(d);

    fs.appendFile('./isbnoutput.txt', response, err => {
            if (err) {
              console.error("write error ", err);
            } else {
              console.error("write success 💃")
            }
          });

    // none of this works. response is not parsable in this way.
    if(!response.items){console.log("no items :( "); return;}

    for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        for (var j = 0; j < item.volumeInfo.industryIdentifiers.length; j++){
          if(item.volumeInfo.industryIdentifiers[j].identifier == "9781581574036"){
            console.log("got it")
            // in production code, item.text should have the HTML entities escaped.
          let content = `${item.volumeInfo.title} ${item.volumeInfo.subtitle}, ${item.volumeInfo.authors[0]}, ${item.volumeInfo.description}`;
          }

          fs.appendFile('/Users/glaistig/fun-codez/isbnoutput.txt', content, err => {
            if (err) {
              console.error(err);
            } else {
              // file written successfully
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