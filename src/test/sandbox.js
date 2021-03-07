const chai = require('chai');
const sinon = require('sinon');
const nock = require('nock');

import app from '../app';

chai.use(require('chai-http'));
chai.use(require('sinon-chai'));
const expect = chai.expect;

module.exports = { app, chai, expect, nock, sinon, };