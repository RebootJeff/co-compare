angular.module('CoCompareApp').provider('UserProvider', function(){
  'use strict';

  this.userData = null;

  this.setUser = function(userFromServer){
    this.userData = {
      name: userFromServer.name,
      fbId: userFromServer.fbId,
      id: userFromServer.id
    };
  };

  this.clearUser = function(){
    userData = null;
  };

  this.getUser = function(){
    return userData;
  };
});
