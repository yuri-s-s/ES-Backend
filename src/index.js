require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('./routes');
const jobVaccine = require('./app/job/jobVaccine');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', index);

app.get(jobVaccine);

app.listen(process.env.PORT || 3000);
