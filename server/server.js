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

// yuck. but it works.
function calculate(toCalculate) {
    let expressionElements = toCalculate.split(/([+*/-])/) 
    operations = ['*','/','+','-'];
    // got the counting part from here while looking for a built in function: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
    counts = {};
    for (let operation of operations) {
        counts[operation] = expressionElements.filter(element => element === operation).length;
    }
    // do the calculation left to right, */ get precedence over -+
    for (let i = 0; i < expressionElements.length; i++) {
        let resolution = 0;
        if (expressionElements[i] === '*') {
            resolution = Number(expressionElements[i-1]) * Number(expressionElements[i+1])
            expressionElements.splice(i-1,3,resolution);
            i -= 2;
        } else if (expressionElements[i] === '/') {
            resolution = Number(expressionElements[i-1]) / Number(expressionElements[i+1])
            expressionElements.splice(i-1,3,resolution);
            i -= 2;
        }
    }
    for (let i = 0; i < expressionElements.length; i++) {
        let resolution = 0;
        if (expressionElements[i] === '+') {
            resolution = Number(expressionElements[i-1]) + Number(expressionElements[i+1])
            expressionElements.splice(i-1,3,resolution);
            i -= 2;
        } else if (expressionElements[i] === '-') {
            resolution = Number(expressionElements[i-1]) - Number(expressionElements[i+1])
            expressionElements.splice(i-1,3,resolution);
            i -= 2;
        }
    }
    return expressionElements[0];
}

function resolve(expressionArray) {

}

app.get('/calcHistory', (req, res) => {
    res.send(calcHistory);
})

app.delete('/clearHistory', (req, res) => {
    calcHistory = [];
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log('servers up');
})

