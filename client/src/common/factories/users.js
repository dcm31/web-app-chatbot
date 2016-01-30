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
    var innerSumTimestampTypes = function(uid, type, startDate, endDate){
      var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
      var count = 0;
      return timestamps.$loaded().then(function(){
        if (typeof endDate === 'undefined'){
          endDate = startDate;
        }
        for(var i = 0; i < timestamps.length; i++){
          if(timestamps[i].type === type && startDate <= brain.getDate(timestamps[i].timestamp) && endDate >= brain.getDate(timestamps[i].timestamp)){
            count = count + 1;
          }
        }
        return count;
      });

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
        sumTimestampTypes: innerSumTimestampTypes,
        getDailyData: function(uid, type, startDate, endDate){
          var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
          var dates= [];
          var dailyTotal= [0];
          var cumulative = [0];
          return timestamps.$loaded().then(function(){
        if (typeof endDate === 'undefined'){
          endDate = startDate;
        }
        var dateIndex = 0;
        for(var i = 0; i < timestamps.length; i++){
          var dateOfEvent = brain.getDate(timestamps[i].timestamp);
          if(timestamps[i].type === type && startDate <= dateOfEvent && endDate >= dateOfEvent)  
            { 
              if(dates.length === 0){
                dates.push(dateOfEvent);
                dailyTotal[0] = 1;
                cumulative[0] = 1;
              }
              if(dates.slice(-1)[0] !== dateOfEvent)
                {
                  dates.push(dateOfEvent);
                  dateIndex++;
                  dailyTotal[dateIndex] = 1;
                  cumulative[dateIndex] = cumulative[dateIndex - 1];
                  
                }
                else{
                  dailyTotal[dateIndex] = dailyTotal[dateIndex]+ 1;
                  cumulative[dateIndex] = cumulative[dateIndex]+ 1;
                }


          }
          
        }

        console.log(dailyTotal);
        console.log(dates);
        console.log(cumulative);
        console.log({x: dates, y: dailyTotal});
        return {x: dates, y: dailyTotal};
      });

        },
        getCumulativeDailyData: function(uid, type, startDate, endDate){
          var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
          var dates= [];
          var dailyTotal= [0];
          var cumulative = [0];
          return timestamps.$loaded().then(function(){
        if (typeof endDate === 'undefined'){
          endDate = startDate;
        }
        var dateIndex = 0;
        for(var i = 0; i < timestamps.length; i++){
          var dateOfEvent = brain.getDate(timestamps[i].timestamp);
          if(timestamps[i].type === type && startDate <= dateOfEvent && endDate >= dateOfEvent)  
            { 
              if(dates.length === 0){
                dates.push(dateOfEvent);
                dailyTotal[0] = 1;
                cumulative[0] = 1;
              }
              if(dates.slice(-1)[0] !== dateOfEvent)
                {
                  dates.push(dateOfEvent);
                  dateIndex++;
                  dailyTotal[dateIndex] = 1;
                  cumulative[dateIndex] = cumulative[dateIndex - 1];
                  
                }
                else{
                  dailyTotal[dateIndex] = dailyTotal[dateIndex]+ 1;
                  cumulative[dateIndex] = cumulative[dateIndex]+ 1;
                }


          }
          
        }

        console.log(dailyTotal);
        console.log(dates);
        console.log(cumulative);
        console.log({x: dates, y: dailyTotal});
        return {x: dates, y: cumulative};
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
