const fetch = require('cross-fetch');
const {foodTrucksAvailableAtGivenTime, getWeekDay, sortByName} = require("../utils/utils")
const {cacheExpiry} = require("../config/appConfig")
const chalk = require("chalk");
const FoodTruck = require("../models/FoodTruck")

//Cache: in-memory for small amount of data
//** For large number of results, fetch pages of the data, and use a distributed cache
let foodTrucksDataCache , foodTrucksDataTimestamp

//PUBLIC
/*
 * Get a sorted list of All the Food Trucks open now
 * @param Date givenDate
 * @return sorted list, ascending, by applicant name
 */
async function getFoodTrucks(givenDate){
  let foodTrucksOpenNow

  if(foodTrucksDataCache){//from cache
    //paginated response
    foodTrucksOpenNow = foodTrucksAvailableAtGivenTime(foodTrucksDataCache, new Date())
    return Promise.resolve({total:foodTrucksOpenNow.length, foodTrucksOpenNow})
  }
  //CACHE EXPIRY = 1 day
  else if(!foodTrucksDataCache ||
      ((Date.now() - foodTrucksDataTimestamp) >= cacheExpiry))
  {
    try{
      //Socrate API:  https://dev.socrata.com/foundry/data.sfgov.org/jjew-r69b
      //NOTE: Using without AppToken - so will get limitted results
      //get food trucks open today
      let url = 'http://data.sfgov.org/resource/bbb8-hzi6.json'
      const weekDay = getWeekDay(givenDate)
      if(weekDay) url = `${url}?dayofweekstr=${weekDay}`

      console.log(chalk.grey(`$$ Fetching ${url} \n`))
      const res = await fetch(url)

      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      const foodTrucks = await res.json()
      foodTrucksDataTimestamp = Date.now()

      //deserialize to model, to detect Public API signature changes
      const foodTrucksDataCache = foodTrucks.map(truck => new FoodTruck(truck))

      //find food trucks open now
      foodTrucksOpenNow = foodTrucksAvailableAtGivenTime(foodTrucksDataCache, givenDate)

      //Sort ASSUMPTION: Alphabetical sorting is done by the Food Truck's Applicant
      foodTrucksOpenNow = sortByName(foodTrucksOpenNow)

      //Unique Food Trucks: API Results are already Unique by (applicant and location)

      return Promise.resolve({total:foodTrucksOpenNow.length, foodTrucksOpenNow})
    }catch(err){
      console.log(chalk.red(`Unable to fetch Food Track data! \n`), err);
      return Promise.reject(err)
    }
  }
}

module.exports = {
  getFoodTrucks: getFoodTrucks
}
