(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    //$logProvider.debugEnabled(true); i don't know what this is for and should ask scott
    $httpProvider.interceptors.push('httpInterceptor');
    $stateProvider
    .state('home',{
        url: '/',
        templateUrl: 'src/app/charlie/chat.tpl.html',
        controller: 'MainCtrl as vm'
       } 
      );
  }

  function MainCtrl($http, $firebaseObject, $log, Auth, $firebaseArray, Users, messages, responseService) {
    var vm = this;
    vm.inputHeight = 0;//document.getElementById('input-field').scrollHeight;
    vm.evalHeight = function(){
      //console.log(document.getElementById('input-field').clientHeight,document.getElementById('input-field').scrollHeight);

      if(document.getElementById('input-field').clientHeight  < document.getElementById('input-field').scrollHeight)
        {
       vm.inputHeight = document.getElementById('input-field').scrollHeight;
      //console.log(vm.inputHeight);
        }
            return vm.inputHeight;
    };
    vm.timeNow = Date.now();
    vm.textClass = 'chat';
    vm.message = '';
    vm.needPlot = true;
    vm.addUserMessage = function(uid, message){

      vm.message='';
      vm.inputHeight = 0;
      return messages.addUserMessage(uid,message);
    };
    vm.respond = function(messageRef){
      return responseService.respond(vm.uid, messageRef);
    };
    vm.submitter = function(uid, message){
      return vm.addUserMessage(uid, message).then(function(messageRef){
        return vm.respond(messageRef).then(function(){
          var hideTextObj = $firebaseObject(Users.getRefBelowUser(uid, 'textHidden'));
          return hideTextObj.$loaded().then(function(innerObj){
            if(innerObj.$value === true){
              vm.textClass = 'hidden-chat';
            }
            else
              {vm.textClass = 'chat';}
          });

        });
    });
    };

    Auth.login().then(function(loginInfo){
      vm.messageString = loginInfo[0];
      vm.uid = loginInfo[1];
      vm.messagesList = $firebaseArray(vm.messageString);
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
	'common.factories.timestampService',
	'common.factories.responseService',
	'common.factories.dates',
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
