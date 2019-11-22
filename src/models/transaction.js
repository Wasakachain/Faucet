const utils = require('../utils/functions');

class Transaction {
    constructor(sender, to, value, fee, data, senderPubKey) {
        this.from = sender;
        this.to = to;
        this.value = value ? value.toString() : value;
        this.fee = fee ? fee.toString() : fee;
        this.dateCreated = new Date().toISOString();
        this.data = data;
        this.senderPubKey = senderPubKey;
    }

    sign(privateKey) {
        this.senderSignature = utils.signTransaction(this, privateKey);
    }

    verify() {
        return utils.verifySignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);
    }

    getData() {
        return {
            from: this.from,
            to: this.to,
            value: this.value,
            fee: this.fee,
            dateCreated: this.dateCreated,
            data: this.data,
            senderPubKey: this.senderPubKey,
        }
    }

    send(providerUrl) {
        let data = this.getData();
        data.transactionDataHash = this.transactionDataHash;
        data.senderSignature = this.senderSignature;
        if(data.data === undefined) {
            delete data.data;
        }
        return utils.request(
            providerUrl+'/transactions/send',
            'POST',
            data
        ).then(() =>{return data});
    } 
}

module.exports = Transaction;