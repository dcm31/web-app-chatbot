(function() {
  'use strict';

  /**
   * @name  auth
   * @description Factory
   */
  function auth (messages, $firebaseAuth, FirebaseUrl, Users) {

    var ref = new Firebase(FirebaseUrl);
    var innerAuthObj = $firebaseAuth(ref);
  
    return {

      login: function(){


        if(innerAuthObj.$getAuth() === null){

             return innerAuthObj.$authAnonymously().then(function(authData) {
            console.log(authData);
            return authData.uid;
          }).then(function(uid){
            Users.usersList().$add(uid);
            return [messages.addZeeMessage(uid, 'Hi new user'), uid];
          }).catch(function(error){
            console.log(error);
          });
        }
        else {
          var authData = innerAuthObj.$getAuth();
          var authPromise = new Promise( function(resolve){
            resolve([messages.getMessagesRef(authData.uid), authData.uid]);
          });
          return authPromise;
        }
      },
      user: {email:'', password:''},
      authObj: innerAuthObj 
    };
    
   /* 
    var innerAuth = this;
    var ref = new Firebase(FirebaseUrl);
    innerAuth.user = {
            email: '',
                  password: ''
                      
    }; 

    innerAuth.firebaseObject = $firebaseAuth(ref);
   
    innerAuth.isAnonymousUser = function () {
      var isAnon = true;
      innerAuth.firebaseObject.$requireAuth().then(function(){
            console.log('it is an anonymous user');
            isAnon = true;
      }, function(){
            console.log('it is not an anonymous user');
            isAnon = false;
      });
      return isAnon; 
  };
    
    innerAuth.login = function (){
        if(innerAuth.isAnonymousUser()=== true){
         console.log('about to log in anonymously');
         innerAuth.firebaseObject.$authAnonymously().then(function(authData) {
            innerAuth.anonAuth = authData;
            console.log('Logged in as:', authData.uid);
            console.log('Auth uid is:', innerAuth.anonAuth.uid);


            console.log('token expires at:', authData.expires);

            Users.usersList().$add(authData.uid);
            console.log(innerAuth.anonAuth);

            var messagesRef = new Firebase(Users.getUserRef(innerAuth.anonAuth.uid)+ '/' + 'messages');
            var messagesList = $firebaseArray(messagesRef);
            console.log('messages ref is ' , String(messagesRef));

            messagesList.$add({

          sender: 'zee',
          body: 'hi',
          timestamp: Firebase.ServerValue.TIMESTAMP
        });

            return messagesRef;

        }).catch(function(error) {
            console.error('Authentication failed:', error);
        });

        } 
        else {
          innerAuth.firebaseObject.$authWithPassword(innerAuth.user).then(function (){
          console.log('authenticated the user with password');
        }, function (error){
              innerAuth.error = error;
        });
        
    }};
   
    innerAuth.register = function (){
        console.log('inside the top of the register function');
        innerAuth.login();
            };

    return innerAuth;*/
  }
  angular.module('common.factories.auth', [])
    .factory('Auth', auth );
})();
