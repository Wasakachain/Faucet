const fs = require('fs');

const cacheFile = './faucet-cache.json';

let _cache;

function getCache() {
    if (fs.existsSync(cacheFile)) {
        try {
            return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        }
        catch (e) {
            console.log('Invalid cache file.');
            console.log('Error: ' + e);
            return false;
        }
    }
    else {
        try {
            fs.writeFileSync(cacheFile, JSON.stringify({}));
            return {};
        }
        catch (e) {
            console.log('failed to created file.');
            console.log('Error: ' + e);
            return false;
        }
    }
}

function initCache(cache) {
    if(!_cache) {
        _cache = getCache();
    }
    return _cache;
}

exports.saveCache = (_cache) => {
    return new Promise((res, rej) => {
        const file = fs.openSync(cacheFile, 'w');
        if(file) {
            fs.write(file, JSON.stringify(_cache, null, '\t'), 0, (err) => {
                if(err) {
                    rej("Failed to save cache file. Error:" + err);
                }
                fs.closeSync(file);
                res(true);
            });
        }
        else { 
            rej("Failed to open cache file.")
        }
    })
}

exports.cache = initCache(_cache); 