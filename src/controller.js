const { saveCache } = require('./cache');
const faucet = require('./faucetAccount');
const { isValidAddress } = require('./utils/functions');
const { WASA, GAR, provider } = require('../index');
const moment = require('moment');

function handleRevertCache(cache, response, err) {
    saveCache(cache).then(()=> {
        response.status(500);
        response.send({error: { message: err}});
    }).catch(() => {
        handleRevertCache(cache, response, err);
    });
}

function getErrorMessage(error) {
    if(error) {
        if(error.data) {
            if(error.data.message) {
                return error.data.message;
            }
        }
        return JSON.stringify(error);
    }
    return 'Unexpected error.'
}

exports.sendCoins = (request, response) => {
    const { address, data } = request.body;
    if(!address) {
        response.status(400);
        response.send({error: { message: 'address param missing.'}});
        return;
    }
    const validatedAddress = isValidAddress(address);
    if(!validatedAddress) {
        response.status(400);
        response.send({error: { message: 'invalid address.'}});
        return;
    }
    if(response.locals.cache[validatedAddress.toLowerCase()]) {
        const lapsedTime = Date.now() - response.locals.cache[validatedAddress.toLowerCase()];
        if(lapsedTime < 60 * 60 * 1000) {
            const timeLeft = parseInt(moment.duration(60 * 60 * 1000 - lapsedTime).asMinutes());
            response.status(400);
            response.send({
                error: { 
                    message: 'You can request 1 coin per hour. You have to wait ' 
                        + (timeLeft > 0 ? `${timeLeft} minutes` : `${timeLeft} minute`)
                        + ' to request another wasa from the faucet.'
                }
            });
            return;
        }
    }
    response.locals.cache[validatedAddress.toLowerCase()] = Date.now();
    saveCache(response.locals.cache).then(()=> {
        faucet.signTransaction(address, WASA, 100 * GAR, data).send(provider).then(tx => {
            response.send({
                message: 'coins sent. tx hash: 0x' + tx.transactionDataHash,
                tx
            });
        }).catch(err => {
            delete response.locals.cache[validatedAddress.toLowerCase()];
            handleRevertCache(response.locals.cache, response, 'Failed to send transaction. Error: ' + getErrorMessage(err));
        })
    }).catch(err => {
        delete response.locals.cache[validatedAddress.toLowerCase()];
        handleRevertCache(response.locals.cache, response, 'error processing request.');
    });
} 