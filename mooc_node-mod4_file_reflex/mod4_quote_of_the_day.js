const fs = require('fs');

exports.quote_of_the_day = () => {
  const contenidoJSON = fs.readFileSync('mod4_quotes_of_the_day.json');
  const arrayJSON = JSON.parse(contenidoJSON);
  const random = Math.floor(Math.random() * arrayJSON.length);

  console.log(arrayJSON[random]);
  console.log();
};
