const Wallet = require('wallet/src/models/wallet');
const mnemonic = require('./mnemonic');

let wallet = new Wallet(mnemonic);

const faucet = new Wallet(mnemonic).accounts[0];

console.log(faucet.getData())
const transaction = faucet.signTransaction(wallet.accounts[1].address, 100, 100.1);
transaction.send('http://localhost:5555').then(console.log).catch(console.log);
