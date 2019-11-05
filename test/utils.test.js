const {foodTrucksAvailableAtGivenTime, sortByName, getPage} = require("../src/utils/utils")
const {data} = require("../test/testData")

describe('Test Utils', () => {
    test('Sort', () => {
        expect(sortByName(data)[0].applicant).toBe('Danas Goodies Catering');
        expect(sortByName(data)[1].location).toBe('900 FRANCISCO ST');
    });

    test('Get Page', () => {
        expect(getPage(data, 1, 0).length).toBe(1);
        expect(getPage(data, 'abc').length).toBe(3);
        expect(getPage(data, 5).length).toBe(3);
        expect(getPage(data, 2, 5).length).toBe(2);
        expect(getPage()).toBe(null);
    });

    test('Get foodTrucks Available At Given Time', () => {
        expect(foodTrucksAvailableAtGivenTime(data, new Date('2019-11-01T13:00:00')).length).toBe(1);
        expect(foodTrucksAvailableAtGivenTime(data, new Date('2019-11-04T12:00:00')).length).toBe(2);
    });
})