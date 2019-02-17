var Controller = require('toto-api-controller');

var getAPIList = require('./dlg/GetAPIList');

var apiName = 'api-list';

var api = new Controller(apiName);

api.path('GET', '/apis', getAPIList);

api.listen();
