const utils = require('../utils/functions');
const Transaction = require('./transaction');
const wasaka44 = require('../utils/bip44-params');
const elliptic = require('elliptic');
const secp256k1 = new elliptic.ec('secp256k1');
const ripemd160 = require('ripemd160');

function getAddress(publicKeyCompressed){
    return new ripemd160().update(publicKeyCompressed).digest('hex');
}

function getCompressedPublicKey(publicPoints){
    return `${utils.toHexString(publicPoints.x)}${publicPoints.encodeCompressed('hex').substring(0,2) === '02' ? 0 : 1}`;
}

function CreateAccount (rootKey, index) {

    let _pathFromRootKey = rootKey.derivePath(wasaka44.mainPath + '/' + index);
    let _keyPair = secp256k1.keyFromPrivate(_pathFromRootKey.privateKey);
    let _publicKey = getCompressedPublicKey(_keyPair.getPublic());
    let _address = getAddress(_publicKey);
    _publicKey = _publicKey;
    let _privateKey = _keyPair.getPrivate().toString('hex');

    class Account {
        get publicKey() {
            return _publicKey;
        }
        get privateKey() {
            return _privateKey;
        }
        get address() {
            return _address;
        }
        getData() {
            return {
                publicKey: _publicKey,
                privateKey: _privateKey,
                address: _address,
            }
        }
        generateTransaction(to, value, fee, data) {
            return new Transaction(this.address, to, value, fee, data, this.publicKey);
        }
        signTransaction(to, value, fee, data) {
            const transaction = this.generateTransaction(to, value, fee, data);
            transaction.sign(this.privateKey);
            return transaction;
        }
    }
    return new Account();
};


module.exports = CreateAccount;