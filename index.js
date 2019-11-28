const Express = require('express');
const path = require('path');
const App = Express();
// importing routes
const { handleNotFound, setCorsHeadersMiddleware, passCacheToRoutes } = require('./src/utils/functions');
const PORT = process.env.port || 5855;

const _provider = process.env.provider || 'http://localhost:5555';
// const _provider = process.env.provider || 'http://192.168.1.175:5555';


exports.provider = _provider;
exports.WASA = 1000000;
exports.AVO = 1000;
exports.GAR = 1;

App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));

// App routes
const Routes = require('./src/routes');
App.use(Express.static(path.join(__dirname, 'public')));
App.use(setCorsHeadersMiddleware);
App.use(passCacheToRoutes);
App.use('/', Routes);
App.use(handleNotFound);

// turn on the server
App.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `\n\Faucet server is running on port ${PORT}!`);
});