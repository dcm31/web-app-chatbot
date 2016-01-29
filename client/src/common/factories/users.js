(function() {
  'use strict';

  /**
   * @name  users
    @description Factory
   */
  function Users ($firebaseArray, $firebaseObject, FirebaseUrl, brain) {
    
    var usersRef = new Firebase(FirebaseUrl+'users');
    var innerUsersList =  $firebaseArray(usersRef);
    var innerGetUserRef = function(uid){
      console.log(usersRef.child(uid));
      return usersRef.child(uid);
    };
    var getRefBelowUser = function(uid, categoryName){
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
        sumTimestampTypes(uid, type, startDate, endDate){
          var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
            var count = 0;
            return timestamps.$loaded().then(function(){
              console.log('count is in here as ', count);
            if (typeof endDate === 'undefined'){
              endDate = startDate;
            }
            for(var i = 0; i < timestamps.length; i++){
              if(timestamps[i].type === type && startDate <= brain.getDate(timestamps[i].timestamp) && endDate >= brain.getDate(timestamps[i].timestamp)){
                count = count + 1;
                console.log(count);
              }
            }
            return count;
          });

        },
        addTimestamp(uid, type){
          var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
          timestamps.$loaded(function(data){
            console.log('length: ', timestamps.length);
            for(var i = 0; i< timestamps.length; i++){
             console.log(timestamps[i].type);
            }
            for(var time in timestamps){
              console.log(time);
            }
                
          });
            
          
          return timestamps.$add({
            timestamp: Firebase.ServerValue.TIMESTAMP,
            type: type

          });
        }
    };
    
    return usersObject;
  }
  angular.module('common.factories.users', [])
    .factory('Users', Users );
})();
