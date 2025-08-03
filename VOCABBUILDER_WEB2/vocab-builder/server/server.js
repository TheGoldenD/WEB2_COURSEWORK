const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
global.Vocab = require('./api/models/vocabModel'); 
const routes = require('./api/routes/vocabRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://longpvhgcs230261:thienlong12@web2.tumm34k.mongodb.net/?retryWrites=true&w=majority&appName=Web2', {
    useNewUrlParser: true,}
);

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to the Vocabulary Builder API');
});

routes(app);
app.listen(port);
app.use((req, res) => {
  res.status(404).send({ url:`${req.originalUrl} Not Found` });
});

console.log(`Server is running on ${port}`);