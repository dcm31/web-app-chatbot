(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    //$logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('httpInterceptor');
    $stateProvider
      .state('root', {
        views: {
          'header': {
            templateUrl: 'src/common/header.tpl.html',
            controller: 'HeaderCtrl'
          },
          'footer': {
            templateUrl: 'src/common/footer.tpl.html',
            controller: 'FooterCtrl'
          }
        }
      })
      .state('home',{
        url: '/',
        templateUrl: 'src/app/charlie/chat.tpl.html',
        controller: 'MainCtrl as vm'


        } 
      );
  }

  function MainCtrl($firebaseObject, $log, Auth, $firebaseArray, Users, messages, brain, Firebase) {
    var vm = this;
    vm.mes = 'hi there';
    vm.message = '';
    vm.addUserMessage = function(uid, message){

      vm.message='';
      return messages.addUserMessage(uid,message);
    };
    vm.respond = function(messageRef){
      var messageBodyRef = messageRef.child('body');
      var messageBodyObject = $firebaseObject(messageBodyRef);
      
      messageBodyObject.$loaded().then(function(data){
        if (data.$value.includes('add')){
          var category = data.$value.replace('add ','');
          return Users.addTimestamp(vm.uid, category).then(function(){
                return messages.addZeeMessage(vm.uid, category +' added');
              });
            }
        else if (data.$value.includes('today')){

          var otherCategory = data.$value.replace(' today','');
          Users.sumTimestampTypes(vm.uid, otherCategory, brain.getDate(Date.now())).then(function(value){
            messages.addZeeMessage(vm.uid, value +' '+ otherCategory);
          }); 
 
        }
        else{
          messages.addZeeMessage(vm.uid, 'I am at a loss for words');
        }
      });
    };
    vm.submitter = function(uid, message){
      return vm.addUserMessage(uid, message).then(function(messageRef){
        return vm.respond(messageRef);
    });
    };

    
    Auth.login().then(function(loginInfo){

//      vm.uid = uid;
  //    console.log('about to add to the users list');
    //  Users.usersList().$add(uid);
  //    console.log('about to add a zee message');
      vm.messageString = loginInfo[0];
      vm.uid = loginInfo[1];
      vm.messagesList = $firebaseArray(vm.messageString);
      messages.addZeeMessage(vm.uid, 'refresh');
      /*vm.messagesList.$watch(function(args){
        console.log(args);
        console.log(args.event);
        if(args.hasOwnProperty('prevChild')){
          vm.messageRef = (vm.messageString.child(args.prevChild)).child('body');

          vm.lastEnteredRef = (vm.messageString.child(args.key)).child('body');
          vm.lastEnteredObject = $firebaseObject(vm.lastEnteredRef); 
          vm.obj = $firebaseObject(vm.messageRef);
          vm.lastEnteredObject.$loaded().then(function(data){
            console.log(data.$value);
            if(data.$value.includes('but')){
              messages.addZeeMessage(vm.uid, 'lol you said a funny word');
              //vm.lastEnteredObject.$loaded().then(function(data){
               // Auth.user.email = data.$value; 
                //console.log(Auth.user.email);

              //});

            }
          });
        }
      });*/
    }); 
  }

  function run($log) {
    $log.debug('App is running!');
  }
          

  angular.module('app', [
      'ui.router',
      'ngMaterial',
      'firebase',
      'getting-started',
      'common.header',
      'common.footer',
      'common.services.data',
      'common.directives.version',
      'common.filters.uppercase',
      'common.interceptors.http',
      'templates',
      /*--YEOMAN-HOOK--*/
	'common.factories.brain',
	'common.factories.messages',
	'common.factories.users',
	'common.factories.view',
	'common.factories.auth',
	'common.factories.isAnonymousService',
	'common.factories.tester',
	'common.directives.firstComponent',
	'common.controllers.FirstComponentDirectiveController',
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .constant('FirebaseUrl', 'http://zee.firebaseio.com/')
    .value('version', '1.1.4');
})();
