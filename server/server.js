const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));

const port = 5000;

app.listen(port, () => {
    console.log('servers up');
    
})

