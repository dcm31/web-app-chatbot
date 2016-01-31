(function() {
  'use strict';

  /**
   * @name  messages
   * @description Factory
   */
  function messages ($firebaseArray, Users) {
    
    return {
      getMessagesRef: function(uid){

        var messagesRef = new Firebase(Users.getUserRef(uid)+ '/' + 'messages');
        return messagesRef;
      },
      addZeeMessage: function (uid, message) {
        var messagesRef = new Firebase(Users.getUserRef(uid)+ '/' + 'messages');
        var messagesList = $firebaseArray(messagesRef);
        console.log('messages ref is ' , String(messagesRef));

        return messagesList.$add({

          sender: 'zee',
          body: message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
      
    },
    addUserMessage: function (uid, message) {
        var messagesRef = new Firebase(Users.getUserRef(uid)+ '/' + 'messages');
        var messagesList = $firebaseArray(messagesRef);
//        console.log('messages ref is ' , String(messagesRef));

        return messagesList.$add({

          sender: uid,
          body: message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
      
    }

  };
  }
  angular.module('common.factories.messages', [])
    .factory('messages', messages );
})();
