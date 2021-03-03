const chai = require('chai');
const sinon = require('sinon');

const app = require('../app');

chai.use(require('chai-http'));

const expect = chai.expect;

module.exports = { app, chai, expect, sinon, };