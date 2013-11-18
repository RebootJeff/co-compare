'use strict';

angular.module('CoCompareApp')
  .controller('HomeCtrl', function ($rootScope, $scope, $http) {
    $scope.loading = true;
    $scope.loggedIn = !!$rootScope.user && !!$rootScope.user.name;
    $http.get('/api/home').success(function(responseData) {
      $scope.loading = false;
      $scope.comparisons = responseData.comparisons;
    });

    var oneLiners = [
      'Decision matrices. Crowd-sourced. \'Nuff said.',
      'Omg. CROWD-SOURCED decision matrices?',
      'How do you compare stuff? Together.',
      'Undecided? Not for long.',
      'Aww yisss... muthahuggin\' decision matrices!'
    ];
    $scope.oneLiner = oneLiners[Math.floor(Math.random() * oneLiners.length)];
  });
