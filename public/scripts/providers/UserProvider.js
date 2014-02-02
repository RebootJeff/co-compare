angular.module('CoCompareApp').provider('UserProvider', function(){
  'use strict';

  var userData = {};

  this.setUser = function(userFromServer){
    this.userData = {
      name: userFromServer.name,
      fbId: userFromServer.fbId,
      id: userFromServer.id
    };
  };

  this.clearUser = function(){
    this.userData = {
      name: '',
      fbId: -1,
      id: -1
    };
  };

  this.$get = function(){
    return {
      getUser: function(){
        return this.userData;
      }
    };
  };
});
