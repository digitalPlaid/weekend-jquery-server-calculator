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
    calcObject.solution = calculate(calcObject);
    console.log(calcObject)
    calcHistory.push(calcObject);

    res.sendStatus(201)
});

function calculate(toCalculate) {
    let numOne = Number(toCalculate.numOne);
    let numTwo = Number(toCalculate.numTwo);
    let operation = toCalculate.operation;
    // find out which operation to use;
    if (operation === 'add') {
        return numOne + numTwo;
    } else if (operation === 'subtract') {
        return numOne - numTwo;
    } else if (operation === 'multiply') {
        return numOne * numTwo;
    } else if (operation === 'divide') {
        return numOne / numTwo;
    }
}

app.get('/calcHistory', (req, res) => {
    console.log('in calcHistorys get request')
    res.send(calcHistory);
})

app.listen(port, () => {
    console.log('servers up');
})

