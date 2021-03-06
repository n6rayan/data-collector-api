import * as chai from 'chai';
import sinon from 'sinon';

import app from '../app';

chai.use(require('chai-http'));
const expect = chai.expect;

export const { app, chai, expect, sinon, };