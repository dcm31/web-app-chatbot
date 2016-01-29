angular.module('common.services.auth', [])
.factory('Auth', function($firebaseAuth, FirebaseUrl){
   'use strict';
    var ref = new Firebase(FirebaseUrl);
    console.log('inside auth service');
    var auth = $firebaseAuth(ref);
    console.log('inside auth service');
    return auth;
  });
