const purpose = "m/44'";
// our picked unused number for wasakachain coin.
// picked from: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinType = "/696969'";
const account = "/0'"
const change = "/0"

const mainPath = purpose + coinType + account + change;

module.exports = {
    mainPath
};