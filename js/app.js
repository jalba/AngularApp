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
        }
    }
});

app.controller('AngCtrl', function($scope, Facebook) {
    $scope.logged = Facebook.getUser(FB);
    $scope.login = function() {
        login();
    };
});

var login = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            token = response.authResponse.accessToken;
            getFriends(FB);
        }
        else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'user_location'});
};

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


