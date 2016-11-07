'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const querystring = require("querystring");

const todos = [
	{
		id: Math.random()+"",
		message: "Eat",
		completed: false
	},
	{
		id: Math.random()+"",
		message: "Code",
		completed: false
	},
	{
		id: Math.random()+"",
		message: "Sleep",
		completed: false
	},
	{
		id: Math.random()+"",
		message: "Repeat",
		completed: false
	}
];

const httpServer = http.createServer(function(req, res) {

	const filePath = './public' + req.url;
	const parsedUrl = url.parse(req.url);
	const parsedQuery = querystring.parse(parsedUrl.query);
    	const method = req.method;

	if(method === 'GET') {

		if (parsedUrl.pathname === "/todos") {
			const json = JSON.stringify(todos);
			res.setHeader("Content-Type", "application/json");
			res.end(json);
			return;
		}

		fs.readFile(filePath, function(err, data) {

        		if (err) {
	    			res.statusCode = 404;
            			res.end('404: File Not Found!');
			}

            		res.statusCode = 200;
	   		res.end(data);
    		});
	}

	if(method === 'POST') {
		if(req.url.indexOf('/todos') === 0) {
            		var reqdata = '';
            		req.on('data', function(item) {
                		reqdata += item;
            		});
            		req.on('end', function () {
                		var jsonObj = JSON.parse(reqdata);
                		jsonObj.id = Math.random() + '';
                		todos[todos.length] = jsonObj;

                		res.setHeader('Content-Type', 'application/json');
                		return res.end(JSON.stringify(jsonObj));
            		});
            		return;
       		}
	}

	if(method === 'DELETE') {

		if(req.url.indexOf('/todos/') === 0) {
            		var id =  req.url.substr(7);

           		for(var i = 0; i < todos.length; i++) {
                		if(id === todos[i].id) {
                    			todos.splice(i, 1);
                    			res.statusCode = 200;
                    			return res.end("YOU KILLED MY TODO!!!!!!");
                		}
           		}
            		res.statusCode = 404;
            		return res.end("Not found");
        	}
	}
});

httpServer.listen(8080, () => console.log('server listen on port 8080'));
