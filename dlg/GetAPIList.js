var http = require('request');
var moment = require('moment');

var cachedApiList;
var cacheTime = null;

/**
 * Retrieves from Github the list of available Toto APIs
 * Returns a [] of
 * {
 *    name :      name of the api (e.g. expenses, api-list)
                  Basically it's the name of the repository without the prefix (toto-nodems-, toto-ms-, toto-ci-)
      localhost : the name of the localhost on the docker engine.
                  it's the name of the GIT repository
      repo :      the full URL of the github repository
      type :      the type of microservice.
                  Basically it's the prefix (toto-nodems, toto-ms, toto-ci, etc.)
 * }
 */
exports.do = function() {

  return new Promise(function(success, failure) {

    if (cacheTime != null) {

      if (moment().unix() - cacheTime < 4000) {
        success(cachedApiList);
        return;
      }

      cacheTime = moment().unix();
    }

    // 1. Call github to get all the microservices
    var repos = [];
    var page = 1;

    var getGithubRepos = function() {

      var data = {
        url : "https://api.github.com/users/nicolasances/repos?page=" + page,
        headers : {
          'User-Agent' : 'node.js',
          'Accept' : 'application/json'
        }
      };

      http.get(data, function(error, response, body) {

        var githubResponse = JSON.parse(body);

        if (githubResponse == null || githubResponse.length == 0) {

          cachedApiList = {apis : buildApis(repos)};
          cacheTime = moment().unix();

          success(cachedApiList);

          return;
        }

        for (var i = 0; i < githubResponse.length; i++) {
          repos.push({name : githubResponse[i].name});
        }

        page++;

        getGithubRepos();

      });
    }

    var buildApis = function(repos) {

      var apis = [];

      for (var i = 0; i < repos.length; i++) {

        var msName = repos[i].name;
        var apiName = null;
        var type = null;

        if (msName.indexOf('toto-ms-') >= 0) {
          apiName = msName.substr('toto-ms-'.length);
          type = 'toto-ms';
        }
        else if (msName.indexOf('toto-nodems-') >= 0) {
          apiName = msName.substr('toto-nodems-'.length);
          type = 'toto-nodems';
        }
        else if (msName.indexOf('toto-ci-') >= 0) {
          apiName = msName.substr('toto-ci-'.length);
          type = 'toto-ci';
        }

        if (apiName != null) apis.push({
          name : apiName,
          localhost : msName,
          repo: 'https://github.com/nicolasances/' + msName + '.git',
          type: type
        });

      }

      return apis;
    }

    getGithubRepos();

  });
}
