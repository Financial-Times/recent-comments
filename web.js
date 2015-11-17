'use strict';

const express = require('express');
const routes = require('./routes');
const app = express();

const server = require('http').Server(app);

app.use('/', routes);
/*eslint-disable no-unused-vars*/
app.use((error, req, res, next) => {
	res.status(500).send('Something went wrong');
});
/*eslint-enable no-unused-vars*/
app.use('*', (req, res) => {
	res.send('This endpoint does not exist');
});

server.listen(process.env.PORT || 4000);


