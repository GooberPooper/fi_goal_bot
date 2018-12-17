const { expect } = require('chai');
const parse = require('../parseCommentBody');
const getSpecificTimeframeComment = (timeframe) => `
    Goals: Max 401k, Max IRA, 40000 brokerage

    timeframe ${timeframe}
`;

const TEST_COMMENT = getSpecificTimeframeComment('quarterly');
describe('parseCommentBody', () => {
    it('should add the goals to the parsed object with an array that derives from the comma separated list', () => {
        expect(parse(TEST_COMMENT).goals).to.deep.equal(['Max 401k', 'Max IRA', '40000 brokerage']);
    });
    describe('before 2019 tests', () => {
        beforeEach(() => {
            Date.now = jest.fn(() => new Date('1989-09-05').getTime());
        });
        afterEach(() => {
            Date.now.mockRestore();
        });
        it('should have the dateOfNextUpdate set to February first if it is monthly', () => {
            expect(parse(getSpecificTimeframeComment('monthly')).dateOfNextUpdate).to.equal('2019-02-01');
        });
        it('should have the dateOfNextUpdate set to the first day of the second quarter of 2019', () => {
            expect(parse(getSpecificTimeframeComment('quarterly')).dateOfNextUpdate).to.equal('2019-04-01');
        });
        it('should have the dateOfNextUpdate set to the first day of the third quarter of 2019 for bi-annually', () => {
            expect(parse(getSpecificTimeframeComment('bi-annually')).dateOfNextUpdate).to.equal('2019-06-01');
        });
        it('should have the dateOfNextUpdate set to the last day of the year for annually', () => {
            expect(parse(getSpecificTimeframeComment('annually')).dateOfNextUpdate).to.equal('2020-01-01');
        });
    });
    describe('after 2019 tests', () => {
        beforeEach(() => {
            Date.now = jest.fn(() => new Date('2019-03-05').getTime());
        });
        afterEach(() => {
            Date.now.mockRestore();
        });
        it('should have the dateOfNextUpdate set to the first day of the next month if it is monthly', () => {
            expect(parse(getSpecificTimeframeComment('monthly')).dateOfNextUpdate).to.equal('2019-04-01');
        });
        it('should have the dateOfNextUpdate set to the first day of the next quarter of 2019', () => {
            expect(parse(getSpecificTimeframeComment('quarterly')).dateOfNextUpdate).to.equal('2019-04-01');
        });
        it('should have the dateOfNextUpdate set to the next closest half of the year', () => {
            expect(parse(getSpecificTimeframeComment('bi-annually')).dateOfNextUpdate).to.equal('2019-06-01');
        });
        it('should have the dateOfNextUpdate set to the last day of the year for annually', () => {
            expect(parse(getSpecificTimeframeComment('annually')).dateOfNextUpdate).to.equal('2020-01-01');
        });
    });
    describe('after 2019, and in the second half of the year', () => {
        beforeEach(() => {
            Date.now = jest.fn(() => new Date('2019-11-05').getTime());
        });
        afterEach(() => {
            Date.now.mockRestore();
        });
        it('should have the dateOfNextUpdate set to the next closest half of the year', () => {
            expect(parse(getSpecificTimeframeComment('bi-annually')).dateOfNextUpdate).to.equal('2020-01-01');
        });
        it('should report the first of the year of 2020 if quarterly', () => {
            expect(parse(getSpecificTimeframeComment('quarterly')).dateOfNextUpdate).to.equal('2020-01-01');
        });
    });
});
