let calculation = {
    numOne: '',
    operation: '',
    numTwo: ''
}

$(document).ready(onReady);

function onReady(){
    // how to collect and where to collect the operation?
    $('.operation').on('click', collectOperation);
    $('#submit').on('click', postCalc);
    $('#clear').on('click', clearVals);
}

function collectOperation() {
    calculation.operation = $(this).attr('id');
};

function clearVals() {
    // console.log('clearing stuff')
    $('input').val('');
    calculation.operation = ''
};

function postCalc() {
    // As is it can post data w/o any fields.
    // probably don't want that - data validation
    calculation.numOne = $('#numOne').val();
    calculation.numTwo = $('#numTwo').val();
    
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