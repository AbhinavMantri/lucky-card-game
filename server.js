import dotenv from 'dotenv';
import express from 'express';
import cardDeck, { cards, faces } from './src/card.js';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index', { cardDeck, cards, faces });
});

app.listen(process.env.PORT);