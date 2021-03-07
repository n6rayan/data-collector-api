const fetch = require('node-fetch');

const dataCollectorApiUrl = 'http://data-collector-api:3001/api/providers';

exports.handler = (event) => {
  const { Records } = event;
  const [message] = Records;

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