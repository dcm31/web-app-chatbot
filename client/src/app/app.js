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
    .state('home',{
        url: '/',
        templateUrl: 'src/app/charlie/chat.tpl.html',
        controller: 'MainCtrl as vm'


        } 
      );
  }

  function MainCtrl($firebaseObject, $log, Auth, $firebaseArray, Users, messages, brain) {
    var vm = this;
    vm.message = '';
    vm.needPlot = false;
    vm.addUserMessage = function(uid, message){

      vm.message='';
      return messages.addUserMessage(uid,message);
    };
    vm.respond = function(messageRef){
      
      var messageBodyRef = messageRef.child('body');
      var messageBodyObject = $firebaseObject(messageBodyRef);
      
      messageBodyObject.$loaded().then(function(data){
        vm.needPlot = false;
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
        else if (data.$value.includes('yesterday')){

          var thirdCategory = data.$value.replace(' yesterday','');
          Users.sumTimestampTypes(vm.uid, thirdCategory, brain.getDate(brain.getYesterday())).then(function(value){
            messages.addZeeMessage(vm.uid, value +' '+ thirdCategory);
          }); 
 
        }
        else if(data.$value.includes('plot')){
          vm.needPlot = true;
          if(data.$value.includes('daily')){

            var TESTER = document.getElementById('tester');
            var keyWord = data.$value.replace('plot daily ',''); 
            Users.getDailyData(vm.uid, keyWord, 20160128, 20160130).then(function(xy){
              Plotly.plot( TESTER, [xy], { 
                margin: { t: 0 } 
              } );


          });
        }
          if(data.$value.includes('cumulative')){

            
            var LESTER = document.getElementById('tester');
            var keyWordTwo = data.$value.replace('plot cumulative ',''); 
            Users.getCumulativeDailyData(vm.uid, keyWordTwo, 20160128, 20160130).then(function(xy){
              Plotly.plot( LESTER, [xy], { 
                margin: { t: 0 } 
              } );


          });
          }
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
