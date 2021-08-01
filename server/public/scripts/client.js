let expressionToSend = '';
$(document).ready(onReady);

function onReady(){
    // how to collect and where to collect the operation?
    $('.updateCalc').on('click', updateCalculation);
    $('#submit').on('click', postCalc);
    $('#clear').on('click', clearVals);
    $('#clearHistory').on('click', clearHistory);
    $(document).on('click', '.historicalCalc', populateCalc)
}

function populateCalc() {
    // could do this two ways: just grab it from dom since it's there
    // or grab it from the server.
    // i'll do both for practice

    // from dom
    // let historicalCalc = $(this).text().split('=')
    // console.log(historicalCalc);
    // $('#expression').val(historicalCalc[0]);
    // $('#solution').text(historicalCalc[1]);
    // I like that this doesn't require the server at all, why involve it if we don't have to?
    // we've already displayed the history, so it's not like it's showing us anything new

    // from server - seems more cumbersome - not sure how to just select a specific piece of data
    // like 'hey server, give me this data based on the info i pass to you'
    // maybe an answer here: https://stackoverflow.com/questions/10298899/how-to-send-data-in-request-body-with-a-get-when-using-jquery-ajax
    elementOfInterest = $(this).attr('id');
    console.log('element of interest: ', elementOfInterest)
    $.ajax({
        method: 'GET',
        url: '/calcHistory',
    }).then( response => {
        console.log('response from server for individual element', response);
        $('#expression').val(response[elementOfInterest].toBeEvaluated);
        $('#solution').text(response[elementOfInterest].solution);
    })
}

function clearHistory() {
    $.ajax({
        method: 'DELETE',
        url: '/clearHistory'
    }).then((response) => {
        $('#calcHistory').empty()
        $('#solution').text('0');
    })
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

function clearVals() {
    // console.log('clearing stuff')
    $('#expression').val('');
};

// validation is kinda hard. There's a ton of things to think about...the user could do anything!
function validEntry() {
    let operations = ['*','/','+','-']
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
    console.log('obj to be sent: ', currentExpression);
    expressionToSend = {toBeEvaluated: currentExpression};
    return true;
}

function postCalc() {
    // data validation:
    if (!validEntry()) {
        alert('Cannot compute. Check your entry.')
        return 'Failed to enter valid data.';
    };

    // send the data to be posted
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: expressionToSend
    }).then(retrieveCalcHistory())
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
        displayArea.append(`<li class="historicalCalc" id="${i}">${calc.toBeEvaluated} = ${calc.solution}</li>`)
    }

}