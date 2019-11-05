const chalk = require("chalk");
const boxen = require("boxen");
const {truckDescriptionLength} = require("../config/appConfig")

const validWeekDays = {sunday:1, monday:2, tuesday:3, wednesday:4, thursday:5, friday:6, saturday:7}

/*
 * This function filters out, any food truck that has not started it service yet, or is not open now
 * @param FoodTruck[] trucks
 * @param Date givenDate
 * @return FoodTruck[] trucksOpen
 */
const foodTrucksAvailableAtGivenTime = (trucks, givenDate = new Date()) => {
    const trucksOpen = trucks.filter(truck => {
        const dayofweekstr = truck.dayofweekstr.toLowerCase()

        //if data missing
        if(!truck.dayofweekstr || !truck.start24 || !truck.end24) return false

        //did the food truck start service already?
        if(new Date(truck.addr_date_create) > givenDate) return false

        //not open today
        if(truck.dayofweekstr &&
            (!validWeekDays[dayofweekstr]
                || (givenDate.getDay() + 1) !== validWeekDays[dayofweekstr]
            )
        ){
            return false
        }

        //ASSUMPTION: Comparing upto minutes is reasonable enough for Food Truck availability
        try{
            const givenDateMin = (givenDate.getHours() * 60) + givenDate.getMinutes()
            return givenDateMin >= hourStrToMin(truck.start24)
                && givenDateMin <= hourStrToMin(truck.end24);
        }catch(e){
            console.log('Parsing Error: foodTrucksAvailableAtGivenTime start-end time', e)
            return false
        }

        return true
    })

    return trucksOpen
}

/*
 * @param data - list of food trucks
 * @return sorted list, ascending, by applicant name and location
 */
const sortByName = (data) => {

    const ascComparator = (a, b) => {
        if(!a.applicant || !b.applicant) return 0

        const aSortStr = a.applicant
        const bSortStr = b.applicant

        if(aSortStr === bSortStr) return 0
        return aSortStr < bSortStr ? -1 : 1
    }

    return data.sort(ascComparator)
}

/*
 * @param data - list of food trucks
 * @param limit - page size
 * @param offset
 * @return sorted list, ascending, by applicant name and location
 */
const getPage = (data, limit = 10, offset = 0) => {
    if(!data) return null
    if(typeof limit !== 'number' ||  typeof offset !== 'number') return data
    if(offset > data.length) offset = 0
    //return all if the data has too few Food Trucks
    if(data.length < limit)  return data

    //return the page of data requested
    return data.filter((item, index) => (index > offset && index <= (offset + limit) ))
}

/*
 * This renders each Food Truck metadata, in a grey box, so that it is easy to read
 * FORMAT: Name, Address, Day, Time
 * @param  FoodTruck truck
 * @return String - decorated Food Truck metadata
 */
const displayFoodTruck = truck => {
    let display = `${truck.applicant}, ${truck.location}, ${truck.dayofweekstr} ${truck.start24} - ${truck.end24}`

    // if(truck.optionaltext){
    //     const desc = truck.optionaltext.length > truckDescriptionLength
    //                 ? (truck.optionaltext.substring(0, truckDescriptionLength) + '...')
    //                 : truck.optionaltext
    //     display += `\n${desc}`
    // }

    return boxen(chalk.green(display),
                {padding: 0, dimBorder: true})
}

/*
 * @param String - 24 hours time format. Example: 14:33
 * @return Number - Minutes equivalent of given time
 */
const hourStrToMin = hourStr => {
    const hourStrArr = hourStr.split(':')
    const hourMin = (parseInt(hourStrArr[0]) * 60) + parseInt(hourStrArr[1])
    return hourMin
}

/*
 * @param Date givenDate
 * @return String - name of the Week day
 */
const getWeekDay = (givenDate) => {
    return givenDate?(new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(givenDate)):null
}

module.exports = {
    sortByName,
    getPage,
    displayFoodTruck,
    foodTrucksAvailableAtGivenTime,
    hourStrToMin,
    getWeekDay
}