(function() {
  'use strict';

  /**
   * @name  users
   @description Factory
   */
  function Users ($firebaseArray, $firebaseObject, FirebaseUrl) {
    var usersRef = new Firebase(FirebaseUrl+'users');
    var innerUsersList =  $firebaseArray(usersRef);
    var innerGetUserRef = function(uid){
      return usersRef.child(uid);
    };
    var innerGetRefBelowUser = function(uid, categoryName){
      return new Firebase(innerGetUserRef(uid)+ '/' + categoryName); 
    };
    var usersObject = {
      getUserRef: innerGetUserRef,
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid){
        return innerUsersList.$getRecord(uid);
      },
      usersList: function(){
        return innerUsersList; 
      },
      getRefBelowUser: innerGetRefBelowUser,
      setTextHiddenness: function(uid, hideText){
        var hideTextObj = $firebaseObject(innerGetRefBelowUser(uid, 'textHidden'));
        return hideTextObj.$loaded().then(function(innerObj){
          innerObj.$value = hideText;
          return innerObj.$save();
        });
        
      }
    };
    return usersObject;
  }
  angular.module('common.factories.users', [])
  .factory('Users', Users );
})();
