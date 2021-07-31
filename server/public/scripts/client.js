let calculation = {
    numOne: '',
    operation: '',
    numTwo: ''
}

$(document).ready(onReady);

function onReady(){
    // how to collect and where to collect the operation?
    $('.updateCalc').on('click', updateCalculation);
    $('#submit').on('click', postCalc);
    $('#clear').on('click', clearVals);
}

function updateCalculation() {
    // all logs in function for figuring out why commas added to the string - shouldn't do it now.
    let update = $(this).attr('id')
    let currentCalc = $('#expression').val()
    // console.log('current value: ', currentCalc);
    currentCalc = currentCalc.split('');
    // console.log('after split is: ', currentCalc)
    // console.log('to be added: ', update);
    currentCalc.push(update)
    currentCalc = currentCalc.join('');
    // console.log('after join: ', currentCalc)
    $('#expression').val(currentCalc);
}

function collectOperation() {
    calculation.operation = $(this).attr('id');
};

function clearVals() {
    // console.log('clearing stuff')
    $('input').val('');
    calculation.operation = ''
};


// validation is kinda hard. There's a ton of things to think about...the user could do anything!
function validEntry() {
    let operations = ['*','/','+','-']
    let allowedChars = ['1','2','3','4','5','6','7','8','9','0','+','-','*','/','.'];
    let currentExpression = $('#expression').val().split(' ').join('')
    // deal with '.' 
        // allow num.num or .num formats only
    // split on all operations
        // get rid of white space, periods will show up as "" in the array after split, which is bad and baffling
    let nonOperations = currentExpression.split(/[+*/-]/) 
    // if any of the entries after splitting are NaN, throw it out
    for (element of nonOperations) {
        if(isNaN(element)) {
            console.log('entry failed to be number');
            return false;
        }
    }
    // I don't believe this is required now, but i'll leave it here, but commented out.
    console.log(nonOperations);
    // if (currentExpression.split('').some(element => !allowedChars.includes(element))) {
    //     console.log('non-allowed characters entered')
    //     return false;
    // }
    // check if there's more than one operation in a row
    for (let i = 1; i < currentExpression.length; i++) {
        if (operations.includes(currentExpression[i]) && operations.includes(currentExpression[i+1])) {
            console.log('faild due to multiple operations in a row (e.g. doesn\'t allow 0 + -1, just use -')
            return false;
        }
    }
    return true;
}

function postCalc() {
    // data validation:
    if (!validEntry()) {
        alert('Cannot compute. Check your entry.')
        return 'Failed to enter valid data.';
    };

    
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: calculation
    }).then(function(response){
        // console.log('success');
        // now get the calcHistory
        retrieveCalcHistory();
        // display calcHistory
    })
    clearVals();
};

function retrieveCalcHistory() {
    $.ajax({
        method: 'GET',
        url: '/calcHistory'
    }).then(function(response) {
        console.log(response);
        $('#solution').empty();
        // display the most recent calculation's solution
        let solution = response[response.length-1].solution
        $('#solution').append(solution)
        // display the history (lifo - most recent at top)
        displayHistory(response);

    })
}

function displayHistory(calculationsArray) {
    // displays history of our calculator in reverse chronological order
    let displayArea = $('#calcHistory')
    $('#calcHistory').empty();
    for (let i = calculationsArray.length-1; i > -1; i--) {
        calc = calculationsArray[i];
        displayArea.append(`<li>${calc.numOne} ${calc.operation} ${calc.numTwo} = ${calc.solution}</li>`)
    }

}