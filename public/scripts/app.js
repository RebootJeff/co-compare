angular.module('CoCompareApp', [])
  .config(function ($routeProvider, $httpProvider) {
    'use strict';

    // __________________________________________________________________
    // Function to check with server about authentication
    var setLoginStatus = function($rootScope, $q, $http){
      // TODO: Using router `resolve` to call this function may not be best practice
      var deferred = $q.defer();
      $http.get('/api/loggedin').success(function(user){
        if(user !== 'no user'){
          $rootScope.user = {
            name: user.name,
            fbId: user.fbId,
            id: user.id
          };
        }
        deferred.resolve();
      });
    };

    // __________________________________________________________________
    // Interceptor for detecting auth errors
    $httpProvider.responseInterceptors.push(function($q, $location){
      return function(promise){
        return promise.then(
          // success callback:
          function(response){
            return response;
          },
          // error callback:
          function(response){
            if(response.status === 401){
              window.alert('server says you must log in to do that');
              $location.url('/');
              return $q.reject(response);
            }
          }
        );
      };
    });

    // __________________________________________________________________
    // Routes
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        resolve: { loggedIn: setLoginStatus }
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl',
        resolve: { loggedIn: setLoginStatus }
      })
      .when('/view/:hash', {
        templateUrl: 'views/viewComparison.html',
        controller: 'ViewComparisonCtrl',
        resolve: { loggedIn: setLoginStatus }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
