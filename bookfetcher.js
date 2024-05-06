const fs = require('node:fs');
const https = require('node:https');

let badisbns = ["1570755183", "0684823780", "0801302307", "094435002X",  "0933368070", "9781570753800",  "087574916X","0875749038","0875749038",  "0944350127", "0062500430", "9781842274392"]

let isbns = ["0961824239","0807011193", "9781497411074", "9781937768027", "0575070315", "0809125102", "1892005026", "1883642450", "066425781X", "091340859X", "1888305045", "9780688172336",   "1888305061", "0875743765", "9780875744124", "0486200221", "0060674296", "094517716X", "0835809005", "9780060608521", "0970302886", "9780143106319", "0060619953", "9798548568311", "0944350674", "0385517521", "0913342750", "9780486431857", "0913408794", "1573247707", "9780911226454", "9780199575763", "0835809714"]

function getMoreInfo(isbn){
  const options = {
    hostname: 'www.googleapis.com',
    path: `/books/v1/volumes?q=${isbn}`,
    method: 'GET',
  };
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
          console.log(book.items[i])
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

// Uncomment to party

// console.log("🕵️‍♂️ searching for ", isbns.length, " books")
// isbns.forEach((i) => getBook(i));
// console.log("🕵️‍♂️ fetching more info about ", badisbns.length, " isbns")
// badisbns.forEach((i) => getMoreInfo(i));