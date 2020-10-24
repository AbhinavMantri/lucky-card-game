import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index', {});
});

app.listen(process.env.PORT);