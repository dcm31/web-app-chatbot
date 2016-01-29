(function() {
  'use strict';

  /**
   * @name  view
   * @description Factory
   */
  function view (Auth, Users, $firebaseArray) {

    console.log(Auth.anonAuth);

    var messagesRef = new Firebase(Users.getUserRef(Auth.anonAuth.uid)+ 'messages');
    var messagesList = $firebaseArray(messagesRef);
    console.log('messages ref is ' , messagesRef);
    return {
      initialize: function(Auth) {
        console.log('inside view initialize function');
        console.log(Auth);
        console.log(Auth.isAnonymousUser());
        if(Auth.isAnonymousUser()){
          console.log('im gonnad do something on startup here');
          return;
        }
        console.log('apparently it was not anon');
      },
      addZeeMessage: function(message) {
          console.log('tryna add a z message to ', messagesRef);
          messagesList.$add({

          sender: 'zee',
          body: message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
        return;
      }

    };
  }
  angular.module('common.factories.view', ['common.factories.auth',])
    .factory('view', view );
})();
