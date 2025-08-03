const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./models/todoListModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://longpvhgcs230261:1122334455balls@web2.tumm34k.mongodb.net/pm76?retryWrites=true&w=majority&appName=Web2');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

const routes = require('./routes/todoListRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);