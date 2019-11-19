const {
    loadAccounts, generateMnemonic,
    decryptMnemonic, encryptMnemonic
} = require('../utils/functions');
const bip39 = require('bip39');

function _fromEncryptedJSON(JSON, password) {
    return decryptMnemonic(JSON, password).then(wallet => new Wallet(wallet.mnemonic));
}

function _createRandom() {
    return new Wallet(generateMnemonic());
}

function Wallet(mnemonic) {
    if(!mnemonic) {
        throw 'mnemonic required.';
    }
    if(mnemonic && !bip39.validateMnemonic(mnemonic)) {
        throw 'Invalid mnemonic.';
    }
    let _mnemonic = mnemonic;

    class SingleWallet {
        constructor() {
            this.accounts = loadAccounts(_mnemonic, 5);
        }

        get mnemonic() {
            return _mnemonic;
        }

        getAccounts() {
            return this.accounts.map(account => account.getData());
        }

        encrypt(password) {
            return encryptMnemonic(this.mnemonic, password)
        }
    }

    return new SingleWallet();
}


Wallet.fromEncryptedJSON = _fromEncryptedJSON;

Wallet.createRandom = _createRandom;

module.exports = Wallet;