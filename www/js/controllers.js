var for_tracking_clicks = new Array();
var click_track;
angular.module('ionicParseApp.controllers',[])

.controller('AppController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };
     $scope.refresh = function() {
        var user = Parse.User.current();
        user.set("ride_cur",-1);
        user.save();
        $state.go('welcome', {
            clear: true
        });
    };
})

.controller('WelcomeController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.login = function() {
        $state.go('app.login');
    };

    $scope.signUp = function() {
        $state.go('app.register');
    };

    if ($rootScope.isLoggedIn) {
        $state.go('app.home');
    }
})

.controller('HomeController', function($scope, $state, $rootScope) {

    if (!$rootScope.isLoggedIn) {
        $state.go('welcome');
        
        
    }


})

.controller('WaitHaveController', function($scope, $state, $rootScope) {

        var query = new Parse.Query(Parse.User);
        var user_tocheck=Parse.User.current();
        query.equalTo("from",user_tocheck.get("from"));
        query.equalTo("to",user_tocheck.get("to"));
        query.equalTo("type",1);
        query.find({
            success: function(user) 
            {
                for (var i = 0; i < user.length; i++) 
                { 
                    var object = user[i];
                    var count=0;
                    if(object.id!=user_tocheck.id)
                    {
                        if(i-count==0)
                        {
                            $scope.user.potential0=object.get('username');
                            for_tracking_clicks[0]=object.get('username');
                        }
                        if(i-count==1)
                        {
                            $scope.user.potential1=object.get('username');
                            for_tracking_clicks[1]=object.get('username');
                        }
                        if(i-count==2)
                        {
                            $scope.user.potential2=object.get('username');
                            for_tracking_clicks[2]=object.get('username');
                        }
                        else
                            count++;
                    }  
                }
            }
        });
        $scope.wait_have_update = function(clicked) 
        {
            click_track=clicked;
            user_tocheck.set("pooling_with",for_tracking_clicks[click_track]);
            user_tocheck.save();
        }
})
.controller('WaitWantController', function($scope, $state, $rootScope) {

        //var query = new Parse.Query(Parse.User);
        var user_tocheck=Parse.User.current();
        var success=0;
        $scope.button = "Start Ride";
        $scope.InfoText = "Please wait for a suggested time of 12 minutes for a call from a potential pooler. ";
        $scope.want_success = function() 
        {
           success=1;
           if(success==1){
                $scope.button = "End Ride";
                $scope.InfoText="Happy Pooling :)";
                var d = document.getElementById("noride");
                d.className = d.className + " ng-hide";
            }   
            
        }
        $scope.want_fail = function(clicked) 
        {
            var to_delete = Parse.Object.extend("ride");
            var query = new Parse.Query(to_delete);
            
            query.equalTo("take_ride",user_tocheck.get("username"));
            query.equalTo("request_logged",1);
            query.equalTo("ride_completed",0);
            query.first({
                success: function(myObj) {
                        // The object was retrieved successfully.
                        
                        myObj.destroy();
                    },
                error: function(object, error) {
            // The object was not retrieved successfully.
             // error is a Parse.Error with an error code and description.
                    }
            });
        }
})

.controller('haveController', function($scope, $state, $rootScope) {

    
        
    
     $scope.user = {};
    $scope.error = {};
    $scope.have_update = function(var1) {

        // TODO: add age verification step

    var d = new Date();
var n = d.getTime();
var user = Parse.User.current();
user.set("ride_cur", var1);
//user.set("from",$scope.user.have_from);
//user.set("to",$scope.user.have_to);
//console.log("Vehicle Type ", var1);
//user.set("timestamp",n);
//user.set("bal",200);
user.save();
}
})
.controller('haveDoneController', function($scope, $state, $rootScope) {
      
   /*var cur_user=Parse.User.current();
   cur_user.set("pooling_with",for_tracking_clicks);
   cur_user.save();
  */
  //console.log("LOL");

      

})

.controller('wantDoneController', function($scope, $state, $rootScope) {
      
//console.log("LOL")  ;

      

})

.controller('updateController', function($scope, $state, $rootScope) {
     $scope.user = {};
    $scope.error = {};
    $scope.update = function() {

        // TODO: add age verification step

    
var user = Parse.User.current();
user.set("bal", $scope.user.newbal);
user.save();        
    };

    
})
.controller('wantController', function($scope, $state, $rootScope, $cordovaGeolocation) {
    if (!$rootScope.isLoggedIn) {
        $state.go('welcome');
    }
     $scope.user = {};
    $scope.error = {};

    $scope.want_update = function(var1) {

        // TODO: add age verification step

//    var d = new Date();
//var n = d.getTime();
var user = Parse.User.current();
var ride1 = Parse.Object.extend("ride");
var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat1  = position.coords.latitude
      var long1 = position.coords.longitude
      
      
      
     // console.log('YO');
      var r1 = new ride1({"from":$scope.user.want_from,"to":$scope.user.want_to,"ride_want":var1,"take_ride":user.get("username"),"request_logged":1, "ride_completed":0,"lat1":lat1,"lon1":long1});           
  r1.save();
user.save();
$state.go('app.wait_want', {
                    clear: true
                });
      
    }, function(err) {
        
                console.log("ERR");
                $scope.error.message = "We couldn't get your location ! Please make sure the GPS is on, and set to high accuracy mode if possible.";
                $scope.$apply();
    });
  
};
})



.controller('LoginController', function($scope, $state, $rootScope, $ionicLoading) {
    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, err) {
                $ionicLoading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Invalid login credentials';
                } else {
                    $scope.error.message = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('app.forgot');
    };
})

.controller('ForgotPasswordController', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };
})

.controller('RegisterController', function($scope, $state, $ionicLoading, $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {

        // TODO: add age verification step

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);
        user.set("bal", 0);
        user.set("ride_cur", -1);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})

.controller('MainController', function($scope, $state, $rootScope, $stateParams, $ionicHistory) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
    }

    $scope.rightButtons = [{
        type: 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {
            $scope.sideMenuController.toggleRight();
        }
    }];

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };

    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleRight();
    };
});
