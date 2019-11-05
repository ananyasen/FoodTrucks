class FoodTruck{
    constructor(foodTruck = {}){

        //deserialize with only the required metadata to reduce memory footprint
        this.applicant = foodTruck.applicant || null
        this.addr_date_create = foodTruck.addr_date_create || null
        this.addr_date_modified = foodTruck.addr_date_modified || null
        this.optionaltext = foodTruck.optionaltext || null

        this.location = foodTruck.location || null
        this.locationdesc = foodTruck.locationdesc || null
        this.latitude = foodTruck.latitude || null
        this.longitude = foodTruck.longitude || null

        this.dayofweekstr = foodTruck.dayofweekstr || null
        this.starttime = foodTruck.starttime || null
        this.endtime = foodTruck.endtime || null
        this.start24 = foodTruck.start24 || null
        this.end24 = foodTruck.end24 || null
    }
}

module.exports = FoodTruck

/** SAMPLE payload: **
{ dayorder: '5',
    dayofweekstr: 'Friday',
    starttime: '12PM',
    endtime: '1PM',
    permit: '19MFF-00052',
    location: '500 FRANCISCO ST',
    locationdesc: '12:17pm-12:20pm',
    optionaltext: 'Cold Truck: Sandwiches, Noodles,  Pre-packaged Snacks, Candy, Desserts Various Beverages',
    locationid: '1336168',
    start24: '12:00',
    end24: '13:00',
    cnn: '5762000',
    addr_date_create: '2011-10-24T16:33:26.000',
    addr_date_modified: '2011-10-24T16:33:46.000',
    block: '0042',
    lot: '022',
    coldtruck: 'Y',
    applicant: 'Anas Goodies Catering',
    x: '6008887.5091',
    y: '2121134.53358',
    latitude: '37.804732309181532',
    longitude: '-122.41348805079673',
    location_2: { type: 'Point', coordinates: [Array] } },
 */