const {MORE, END} = require("../enums/enums")

module.exports = {
  questions : {
    "pageSizeQuestions" : [
      {
        "type": "list",
        "name": "LIMIT",
        "message": "Select List size and Starting Index. \n How many food trucks do you want to see at a time?",
        "choices": ["5" ,"10", "20", "40", "50"]
      },
      {
        "type": "input",
        "name": "START",
        "message": "Optional. Enter start index. Should be a positive number: "
      }
    ],
    "seeMore" : [
      {
        "name": "NEXT",
        "type": "list",
        "message": "Do you want to see more food trucks?",
        "choices": [MORE, END]
      }
    ]
}}