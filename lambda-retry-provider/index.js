const fetch = require('node-fetch');

// TODO: Find out how to connect Lambda to containers - https://github.com/localstack/localstack/issues/381

exports.handler = (event) => {
  const { Records } = event;
  const [ message ] = Records;

  // const dataCollectorApiUrl = 'http://data-collector-api:3001/providers';
  const dataCollectorApiUrl = 'http://localhost:3001/providers';

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