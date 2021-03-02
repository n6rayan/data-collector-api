const providers = require('../providers.json');

module.exports.getProvider = (req, res) => {
  const bills = providers[req.params.id];

  if (!bills) return res.status(404).end();

  return res.send(bills);
};