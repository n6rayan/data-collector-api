const fetch = require('node-fetch');

exports.handler = (event) => {
  const { Records } = event;
  const [ message ] = Records;

  const dataCollectorApiUrl = 'http://data-collector-api:3001/providers';

  return fetch(dataCollectorApiUrl, {
    method: 'POST',
    body: message.body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((error) => console.log(error));
};