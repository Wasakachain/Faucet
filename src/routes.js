const Router = require('express').Router();
const Controller  = require('./controller');

// defining the routes for the block model
Router.get('/', ({res}) => {
    res.sendFile(__dirname.replace(/src.*/g, 'public/index.html'));
});
Router.post('/send-coins', Controller.sendCoins); //done

module.exports = Router;
