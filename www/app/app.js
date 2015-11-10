'use strict';

var angular = require('angular');
require('../lib/feedhenry');

angular.module('wfm-mobile', [
  require('angular-touch')
, require('angular-messages')
, require('angular-ui-router')
, require('angular-animate')
, require('angular-aria')
, require('angular-material')

, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
, require('fh-wfm-workflow')
, require('fh-wfm-appform')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')

, require('./workorder/workorder')
, require('./workflow/workflow')
, require('./message/message')
, require('./map/map')
, require('./setting/setting')
, require('./auth/auth')
])

.config(function($stateProvider, $urlRouterProvider) {
  // if none of the states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/workorders');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      resolve: {
        workorderModuleInit: function(mediator) {
          return mediator.request('module:init:workorder')
        }
      },
      controller: function($scope, $state, $mdSidenav){
        $scope.$state = $state;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            $state.go(state, params);
          }
        }
      }
    })
})

.run(function($rootScope) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});
