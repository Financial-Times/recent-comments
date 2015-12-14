'use strict';

const join = require('path').join;
const express = require('express');
const routes = require('./routes');
const app = express();

const server = require('http').Server(app);

app.use(express.static(join(__dirname, '/static')));
app.use('/', routes);
app.get(['/', '/v1'], (req, res) => {
	res.redirect('/apidoc');
});
/*eslint-disable no-unused-vars*/
app.use((error, req, res, next) => {
	res.status(500).end('Something went wrong');
});
/*eslint-enable no-unused-vars*/
app.use('*', (req, res) => {
	res.status(404).end('This endpoint does not exist');
});

server.listen(process.env.PORT || 4000);


