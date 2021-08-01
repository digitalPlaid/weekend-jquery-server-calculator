const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static('./server/public/'));

const port = 5000;

let calcHistory = []

app.post('/calculate', (req, res) => {
    console.log('received contact from client')
    let calcObject = req.body;
    // console.log('calc object', calcObject)
    calcObject.solution = calculate(calcObject.toBeEvaluated)
    console.log(calcObject.solution);
    calcHistory.push(calcObject);
    res.sendStatus(201)
});

// fyi this currently acts a bit weird - if you wrote 36/12*3 you get back 1, not 9, it gives precedence to multiplication.
// imo not a huge deal, as long as users understand that 
function calculate(toCalculate) {
    let expressionElements = toCalculate.split(/([+*/-])/) 
    // console.log(expressionElements)
    // perform operations in the correct order: (pe)mdas, left to right
    operations = ['*','/','+','-'];
    // got the counting part from here while looking for a built in function: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
    counts = {};
    for (let operation of operations) {
        counts[operation] = expressionElements.filter(element => element === operation).length;
    }
    for (let operation of Object.keys(counts)) {
        // console.log('operation: ', operation);
        // console.log('count of operation: ', counts[operation]);
        for (let i = counts[operation]; i > 0; i--) {
            let index = expressionElements.indexOf(operation);
            let numOne = Number(expressionElements[index-1]);
            let numTwo = Number(expressionElements[index+1])
            // console.log('current state: ', expressionElements);
            if (operation === '*') {
                let expressionResolution = numOne * numTwo;
                expressionElements.splice(index-1,3,expressionResolution);
            } else if (operation === '/') {
                let expressionResolution = numOne / numTwo;
                expressionElements.splice(index-1,3,expressionResolution);
            } else if (operation === '+') {
                let expressionResolution = numOne + numTwo;
                expressionElements.splice(index-1,3,expressionResolution);
            } else if (operation === '-') {
                let expressionResolution = numOne - numTwo;
                expressionElements.splice(index-1,3,expressionResolution);
            }
        }
    }
    return expressionElements[0];
}

function resolve(expressionArray) {

}

app.get('/calcHistory', (req, res) => {
    res.send(calcHistory);
})

app.listen(port, () => {
    console.log('servers up');
})

