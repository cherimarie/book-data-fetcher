const fs = require('node:fs');

const https = require('node:https');

let isbns = ["0961824239","0807011193", "9781497411074"]

function getBook(isbn){
  const options = {
    hostname: 'www.googleapis.com',
    path: `/books/v1/volumes?q=+isbn:${isbn}`,
    method: 'GET',
  };

  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    res.setEncoding('utf8');
    let rawData = '';

    res.on('data', (chunk) => {
      rawData += chunk;
    });

    res.on('end', () => {

      try {
        const book = JSON.parse(rawData);

        if(!book.items){console.log("no items :( "); return;}

        for (var i = 0; i < book.items.length; i++) {
          var item = book.items[i];
          for (var j = 0; j < item.volumeInfo.industryIdentifiers.length; j++){
            console.log("book item index ", i, " isbn ", item.volumeInfo.industryIdentifiers[j].identifier)

            if(item.volumeInfo.industryIdentifiers[j].identifier == isbn){
              console.log("got it")

              let content = `\n${item.volumeInfo.title} ${item.volumeInfo.subtitle || ''}*${item.volumeInfo.authors.join()}*${item.volumeInfo.description || '  '}*${isbn}*${item.volumeInfo.publishedDate}`;

              fs.appendFile('./output.csv', content, err => {
                if (err) {
                  console.error('Write error: ', err);
                } else {
                  console.log('Write success 🕺')
                }
              });
            }

          }

        }
      } catch (e) {
        console.error(e.message);
      }

    });
  });

  req.on('error', (e) => {
    console.error('Request error: ', e);
  });
  req.end();
}

isbns.forEach((i) => getBook(i))