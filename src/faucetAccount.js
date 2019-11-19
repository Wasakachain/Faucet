const Wallet = require('wallet/src/models/wallet');
const mnemonic = require('../faucetMnemonic');

let _faucet;

function initAccount(faucet) {
    if(!faucet) {
        faucet = new Wallet(mnemonic).accounts[0];
    }
    return faucet;
}

module.exports = initAccount(_faucet);