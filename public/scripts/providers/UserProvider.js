angular.module('CoCompareApp').provider('UserProvider', function(){
  'use strict';

  var userData = {};

  // this.setUser = function(userFromServer){
  //   userData = {
  //     name: userFromServer.name,
  //     fbId: userFromServer.fbId,
  //     id: userFromServer.id
  //   };
  // };

  // this.clearUser = function(){
  //   userData = {
  //     name: '',
  //     fbId: -1,
  //     id: -1
  //   };
  // };

  this.$get = function(){
    return {

      getUser: function(){
        return userData;
      },

      setUser: function(userFromServer){
        userData = {
          name: userFromServer.name,
          fbId: userFromServer.fbId,
          id: userFromServer.id
        };
      },

      clearUser: function(){
        userData = {
          name: '',
          fbId: -1,
          id: -1
        };
      }

    };
  };

});
