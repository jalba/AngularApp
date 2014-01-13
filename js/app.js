var app = angular.module('AngularApp', []);


app.factory('Facebook', function($q, $rootScope) {
    var self = this;
    resolve = function(errval, retval, deferred) {
        $rootScope.$apply(function() {
            if (errval) {
                deferred.reject(errval);
            } else {
                retval.connected = true;
                deferred.resolve(retval);
            }
        });
    };

    return {
        getUser: function(FB) {
            console.log('fired');
            var deferred = $q.defer();
            FB.getLoginStatus(function(response) {
                if (response.authResponse) {
                    resolve(null, response, deferred);
                    token = response.authResponse.accessToken;
                    getFriends(FB);
                 }
            },true);
            promise = deferred.promise;
            promise.connected = false;
            return promise;
        },
        login: function(FB) {
            FB.login(function(response) {
                if (response.authResponse) {
                     token = response.authResponse.accessToken;
                     document.getElementById( 'login' ).style.display = 'none';
                     document.getElementById( 'connected' ).style.display = 'block';
                     getFriends(FB);
                }
                else {
                   console.log('User cancelled login or did not fully authorize.');
                }
            }, {scope: 'user_location'});
        }
    }
});

app.controller('AngCtrl', function($scope, Facebook) {
    $scope.logged = Facebook.getUser(FB);
    $scope.login = function() {
      Facebook.login(FB);
      $scope.logged.connected  = true;
    };
    
});

var getFriends = function(FB) {
    FB.api('/me/friends', function(response){
        if (response && response.data){
            var friendsListContainer=document.getElementById("friendContainer");
            var fData=response.data;
            for (var friendIndex=0; friendIndex<fData.length; friendIndex++) {
                var friend = document.createElement("div");
                friend.className = "friend";
                var picture = document.createElement("img");
                picture.src = "https://graph.facebook.com/"+ fData[friendIndex].id +"/picture";
                friend.appendChild(picture);
                var name = document.createElement("b");
                name.innerHTML = fData[friendIndex].name;
                friend.appendChild(name);
                friendsListContainer.appendChild(friend);
            }
        } else {
            console.log('Something goes wrong', response);
        }
    });         
}


