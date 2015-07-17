/**
 * Created by johannes on 17.07.15.
 */
/**
 * Created by johannes on 28.04.15.
 */

Array.prototype.next = function() {
  return this[++this.current];
};
Array.prototype.prev = function() {
  return this[--this.current];
};
Array.prototype.current = 0;

define(['angularAMD', 'jquery'], function (angularAMD) {
  var app = angular.module("boilerplateApp", []);

  app.controller('ExampleController', function($scope, $sce){

    $scope.urls = JSON.parse(window.localStorage.getItem('website_rotator_urls')) || [];

    if (0 === $scope.urls.length) {
      $scope.urls = ['http://example.com'];
    }

    $scope.activeWebsite = $sce.trustAsResourceUrl($scope.urls[0]);


    $scope.removeElement = function (url) {
      for (var key in $scope.urls) {
        if ($scope.urls[key] == url) {
          $scope.urls.splice(key, 1);
        }
      }

      window.localStorage.setItem('website_rotator_urls', JSON.stringify($scope.urls));
    }

    $scope.addElement = function (newUrl) {
      $scope.urls.push($scope.urlnew);
      $scope.urlnew = '';

      window.localStorage.setItem('website_rotator_urls', JSON.stringify($scope.urls));
    }

    $scope.closeMenu = function () {
      angular.element('.menu').addClass('hidden');
    };


    $scope.openMenu = function (event) {
      if (event.clientY < 5) {
        angular.element('.menu').removeClass('hidden');
      }
    };

    $scope.refreshRate = 5000;

    $scope.changeRefreshRate = function () {
      clearInterval($scope.updateInterval);
      createRefreshInterval()
    };

    createRefreshInterval = function () {
      $scope.updateInterval = setInterval(function () {
        var newUrl = $scope.urls.next();

        if ('undefined' === (typeof newUrl)) {
          //$scope.urls = $scope.urls;
          $scope.urls.current = -1;
          newUrl = $scope.urls.next();
        }

        $scope.activeWebsite = $sce.trustAsResourceUrl(newUrl);
        $scope.$apply();
      }, $scope.refreshRate);
    };

    createRefreshInterval();



  }).directive('myIframe', function() {
    return {
      template: '<iframe src="{{activeWebsite}}" class="website-container" />'
    };
  });
  return angularAMD.bootstrap(app);
});