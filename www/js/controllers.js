angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $localstorage) {
  $scope.eventDay = {
    date: new Date('September 4, 2015 21:42:00'),
    eventDetails: 'My Event'
  };
  var eventDay = $localstorage.getObject('eventDay');
  if(eventDay && eventDay.value){
    $scope.eventDay.date = new Date(eventDay.value);
    $scope.eventDay.eventDetails = eventDay.name;
  }
  $scope.timeTillEvent = {};
  var updateClock = function () {
    $scope.seconds = ($scope.eventDay.date - new Date()) / 1000;
    $scope.timeTillEvent = {
      daysLeft: parseInt($scope.seconds / 86400),
      hoursLeft: parseInt($scope.seconds % 86400 / 3600),
      minutesLeft: parseInt($scope.seconds % 86400 % 3600 / 60),
      secondsLeft: parseInt($scope.seconds % 86400 % 3600 % 60)
    };

    var width = ($scope.timeTillEvent.secondsLeft/60) * 100 ;
    var el = angular.element(document.querySelector('.seconds-timer-running .seconds-timer-progress')).css('width', width + '%');

    $scope.inValidEvent = $scope.timeTillEvent.daysLeft < 0 || $scope.timeTillEvent.hoursLeft<0 || $scope.timeTillEvent.minutesLeft <0 || $scope.timeTillEvent.secondsLeft <0;
    if($scope.inValidEvent){
      clearInterval($scope.timerInterval);
    }
  };




  $scope.timerInterval = setInterval(function () {
    $scope.$apply(updateClock);
  }, 1000);
  updateClock();
})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $localstorage) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.event = {
    name: 'My Event',
    info: 'Tap anywhere on the card to open the modal',
    value: 'October 25, 2015 21:42:00'
  }

  $ionicModal.fromTemplateUrl('event-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    $localstorage.setObject('eventDay', $scope.event);
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.popover.remove();
  });

  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  // Triggered on a button click, or some other target
  $scope.showPopup = function() {
    $scope.data = {}

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.wifi">',
      title: 'Enter Wi-Fi Password',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };
  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Consume Ice Cream',
      template: 'Are you sure you want to eat this ice cream?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  // An alert dialog
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Don\'t eat that!',
      template: 'It might taste good'
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };


});
