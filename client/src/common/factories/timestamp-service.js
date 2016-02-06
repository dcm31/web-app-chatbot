(function() {
  'use strict';

  /**
   * @name  timestampService
   * @description Factory
   */
  function timestampService (FirebaseUrl, $firebaseArray, dates, Users) {
    var getRefBelowUser = Users.getRefBelowUser; 
    var innerSumTimestampTypes = function(uid, type, startDate, endDate){
      var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
      var count = 0;
      return timestamps.$loaded().then(function(){
        if (typeof endDate === 'undefined'){
          endDate = startDate;
        }
        for(var i = 0; i < timestamps.length; i += 1){
          if(timestamps[i].type === type && startDate <= dates.getDate(timestamps[i].timestamp) && endDate >= dates.getDate(timestamps[i].timestamp)){
            count = count + 1;
          }
        }
        return count;
      });
    };
    function getDateList(uid, startDate, endDate, type){
      var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
      var dateList= [];
      return timestamps.$loaded().then(function(){
        if (typeof endDate === 'undefined'){
          endDate = startDate;
        }
        for(var i = 0; i < timestamps.length; i += 1){
          var dateOfEvent = dates.getDate(timestamps[i].timestamp);
          if(timestamps[i].type === type && startDate <= dateOfEvent && endDate >= dateOfEvent)  
            { 
              if(dateList.length === 0){
                dateList.push(dateOfEvent);
              }
              if(dateList.slice(-1)[0] !== dateOfEvent)
                {
                  dateList.push(dateOfEvent);
                }
            }
        }
        return dateList;
      });
    }
    function makeTotals(uid, type, dateList){
      var dailyTotalOther = [];
      var totalDataPromise = new Promise(function(resolve){
        var sumPromise; 
        async.each(dateList, function(element, callback){
          innerSumTimestampTypes(uid, type, element, element).then(function(val){
            dailyTotalOther.push(val);
          });
          callback();
        }, function(){
          sumPromise = Promise.resolve({x: dateList, y: dailyTotalOther}); 
        });
        resolve(sumPromise);
      });
      return totalDataPromise;
    }
    function accumulateTotal(dataObject){
      var previousYValues = dataObject.y;
      var accumulateArray = [];
      function add(a, b) {
        console.log(accumulateArray);
        accumulateArray.push(a+b);
        return a + b;
      }
      previousYValues.reduce(add, 0);
      var accumulateTotalPromise = Promise.resolve({x: dataObject.x, y: accumulateArray});
      return accumulateTotalPromise;
    }
    function innerGetDailyData(uid, type, startDate, endDate){
        return getDateList(uid, startDate, endDate, type).then(function(dateList){
          return makeTotals(uid, type, dateList);
      });
      }

    var timestampObject = {
      sumTimestampTypes: innerSumTimestampTypes,
      getDailyData: innerGetDailyData,
      getCumulativeDailyData: function(uid, type, startDate, endDate){
        return innerGetDailyData(uid, type, startDate, endDate).then(function(prom){
          return accumulateTotal(prom);
        });
      },
      addTimestamp: function(uid, type){
        var timestamps = $firebaseArray(getRefBelowUser(uid, 'timestamps'));
        return timestamps.$add({
          timestamp: Firebase.ServerValue.TIMESTAMP,
          type: type
        });
      }
    };
    return timestampObject;
  }
  angular.module('common.factories.timestampService', [])
  .factory('timestampService', timestampService );
})();
