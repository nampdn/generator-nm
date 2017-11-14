import chai from 'chai';
import { Convert } from '../src/index';
import m from '.';

chai.expect();
const expect = chai.expect;

describe('core/convert.js', () => {
  it('should throw exception', () => {
		expect(m(123)).to.throw('Expected a string, got number');
	});
	it('should works', () => {
		expect(m('unicorns')).to.be.equal('unicorns & rainbows');
	});
});
