const fs = require('node:fs');

const https = require('node:https');

let isbns = ["0961824239","0807011193", "9781497411074", "9781937768027", "0575070315", "0809125102", "1892005026", "1883642450", "066425781X", "091340859X", "1888305045", "9780688172336", "1850721041", "094435002X"]

function getBook(isbn){
  const options = {
    hostname: 'www.googleapis.com',
    path: `/books/v1/volumes?q=+isbn:${isbn}`,
    method: 'GET',
  };
  let keeper;
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    let rawData = '';

    res.on('data', (chunk) => {
      rawData += chunk;
    });

    res.on('end', () => {

      try {
        const book = JSON.parse(rawData);

        if(!book.items){console.log("🤦 no query results for isbn", isbn); return;}

        for (var i = 0; i < book.items.length; i++) {
          var item = book.items[i];
          for (var j = 0; j < item.volumeInfo.industryIdentifiers.length; j++){
            if(item.volumeInfo.industryIdentifiers[j].identifier == isbn){
              keeper = item.volumeInfo;
            }
          }
        }
        if(!keeper){
          console.log('🤦 no matching record found for isbn ', isbn);
        } else {
          console.log("🛟 found a record for isbn ", isbn)
          let content = `\n${keeper.title} ${keeper.subtitle || ''}*${keeper.authors.join()}*${keeper.description || '  '}*${isbn}*${keeper.publishedDate}`;

          fs.appendFile('./output.csv', content, err => {
            if (err) {
              console.error('File write error: ', err);
            }
          });
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

console.log("🕵️‍♂️ searching for ", isbns.length, " books")
isbns.forEach((i) => getBook(i))