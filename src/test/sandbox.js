const chai = require('chai');
const sinon = require('sinon');

const server = require('../server');

chai.use(require('chai-http'));

const expect = chai.expect;

module.exports = { server, chai, expect, sinon, };