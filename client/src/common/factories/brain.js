(function() {
  'use strict';

  /**
   * @name  brain
   * @description Factory
   */
  function brain (Users, $http, messages, $firebaseObject) {

    return {
      getDate: function(unixEpoch) {
        var dater = new Date(unixEpoch);
        var iso = dater.toISOString();
        return parseInt(iso.substring(0,10).replace(/-/g,''));
      },
      getYesterday: function(){
        return Date.now()-30*3600000;
      },
      respond: function(uid, messageRef){
      
       
      var messageBodyRef = messageRef.child('body');
      var messageBodyObject = $firebaseObject(messageBodyRef);
      
      messageBodyObject.$loaded().then(function(data){
        var lastUserMessage = data.$value;
        var numberOfWordsInMessage = lastUserMessage.split(' ').length;
        if (numberOfWordsInMessage === 2 && lastUserMessage.includes('add')){
          var category = data.$value.replace('add ','');
          return Users.addTimestamp(uid, category).then(function(){
                return messages.addZeeMessage(uid, category +' added');
              });
            }
        else if (data.$value.includes('today')){

          var otherCategory = data.$value.replace(' today','');
          Users.sumTimestampTypes(uid, otherCategory, brain.getDate(Date.now())).then(function(value){
            messages.addZeeMessage(uid, value +' '+ otherCategory);
          }); 
 
        }
        else if (data.$value.includes('yesterday')){

          var thirdCategory = data.$value.replace(' yesterday','');
          Users.sumTimestampTypes(uid, thirdCategory, brain.getDate(brain.getYesterday())).then(function(value){
            messages.addZeeMessage(uid, value +' '+ thirdCategory);
          }); 
 
        }
        else if(data.$value.includes('plot')){
          if(data.$value.includes('daily')){

            var TESTER = document.getElementById('tester');
            var keyWord = data.$value.replace('plot daily ',''); 
            Users.getDailyData(uid, keyWord, 20160128, 20160130).then(function(xy){
              Plotly.plot( TESTER, [xy], { 
                margin: { t: 0 } 
              } );


          });
        }
          if(data.$value.includes('cumulative')){

            
            var LESTER = document.getElementById('tester');
            var keyWordTwo = data.$value.replace('plot cumulative ',''); 
            Users.getCumulativeDailyData(uid, keyWordTwo, 20160128, 20160130).then(function(xy){
              Plotly.plot( LESTER, [xy], { 
                margin: { t: 0 } 
              } );


          });
          }
        }
        else if(lastUserMessage.includes('github issues')){

         $http({
             method: 'GET',
               url: 'https://www.kimonolabs.com/api/5axqzhhm?kimmodify=1?apikey=hQyUIsOdhJ88Z0J7IQc5UHcn9C5e9nOL'
               
         }).then(function successCallback(response) {
               // this callback will be called asynchronously
           //     // when the response is available
           console.log(response.data.results.collection1);
           response.data.results.collection1.forEach(function(issueObj){
             
             messages.addZeeMessage(uid, issueObj.issueNumber + '. ' + issueObj.issue.text);
             
           });
         }, function errorCallback(response) {
           console.log(response);
               // called asynchronously if an error occurs
           //     // or server returns response with an error status.
           //       
         }); 
            // called asynchronously if an error occurs
        // k
        //     // or server returns response with an error status.
        //       
        }
        else if(lastUserMessage.includes('what should I work on')){
         $http({
             method: 'GET',
               url: 'https://www.kimonolabs.com/api/5axqzhhm?kimmodify=1?apikey=hQyUIsOdhJ88Z0J7IQc5UHcn9C5e9nOL'
               
         }).then(function successCallback(response) {
               // this callback will be called asynchronously
           //     // when the response is available
           var issuesArray = response.data.results.collection1; 
           var lastIssueText = issuesArray[issuesArray.length -1].issue.text;
           var lastIssueNumber = issuesArray[issuesArray.length -1].issueNumber; 
           messages.addZeeMessage(uid, 'How about issue '+ lastIssueNumber + ':\n'+ lastIssueText);
         
         }, function errorCallback(response) {
           console.log(response);
               // called asynchronously if an error occurs
           //     // or server returns response with an error status.
           //       
         }); 
            // called asynchronously if an error occurs
        // k
        //     // or server returns response with an error status.
        //       
        }
        else{

                     messages.addZeeMessage(uid, 'Mhm');
        }
        
    
    });
    }
    };
  }
  angular.module('common.factories.brain', [])
    .factory('brain', brain );
})();
