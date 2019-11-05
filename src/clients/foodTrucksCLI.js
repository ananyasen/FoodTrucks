const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const {questions} = require("../config/cliQuestions")
const {getFoodTrucks} = require("../services/FoodTruckFinder")
const {displayFoodTruck, getPage} = require("../utils/utils")
const {MORE, END} = require("../enums/enums")

let viewedOffset = 0

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("Find Food Trucks!", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    )

    console.log(chalk.green.bold(`HUNGRY?? Let's find some Food Trucks! \n`));
}

const run = async () => {
    // show script introduction
    init();
    // ask questions
    let { LIMIT , START } = await inquirer.prompt(questions.pageSizeQuestions);
    //page size
    LIMIT = parseInt(LIMIT);

    if(!START || isNaN(START)){
        console.log(chalk.red.bold(`Start index should be a valid number. Will default to 0. \n`));
    }else{
        START = parseInt(START);
        if(START < 0){
            console.log(chalk.red.bold(`Start index should be a positive number. Will default to 0. \n`));
        }else{
            viewedOffset = START
        }
    }

    //First Page: get food trucks data
    let {total, foodTrucksOpenNow} = await getFoodTrucks(new Date())

    //paginated response to render
    let foodTrucksList = getPage(foodTrucksOpenNow, LIMIT, viewedOffset)

    // show result
    if(viewedOffset > total){
        console.log(chalk.red.bold(`Found total ${total} Food Trucks. Start index was too high. Here are the first ${LIMIT}: \n`));
    }
    else{
        console.log(chalk.green.bold(`Found total ${total} Food Trucks. Here are the ${LIMIT} result after start index ${viewedOffset}: \n`));
    }

    console.log(chalk.green.bold(`FORMAT:: Name, Address, Day, Time \n`));
    foodTrucksList.forEach(truck => {
        console.log(`${displayFoodTruck(truck)}`);
    })
    console.log();

    //Get ready to show more
    viewedOffset += LIMIT

    // ask if see more -- any key entry is ok
    while(viewedOffset <= total){
        const { NEXT } = await inquirer.prompt(questions.seeMore);
        if(NEXT === MORE){
            foodTrucksList = getPage(foodTrucksOpenNow, LIMIT, viewedOffset)
            // show result
            console.log(chalk.green.bold(`Here are ${foodTrucksList.length} more Food Trucks! \n`));
            foodTrucksList.forEach(truck => {
                console.log(displayFoodTruck(truck));
            })
            console.log('\n')
            viewedOffset += LIMIT
        }
        else if(NEXT === END){
            break
        }
    }

    if(viewedOffset >= total){
        console.log(chalk.green.bold(`End of list! \n`));
    }
};

run();

