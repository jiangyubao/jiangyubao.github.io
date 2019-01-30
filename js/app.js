angular.module('inbox', ['ionic', 'inbox.controllers'])
    .run(function ($ionicPlatform, $http) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/login/sign-in.html',
                controller: 'SignInCtrl'
            })
            .state('forgotpassword', {
                url: '/forgot-password',
                templateUrl: 'templates/login/forgot-password.html'
            })
            .state('sideMenu', {
                url: "/sideMenu",
                templateUrl: "templates/side-menu.html"
            })
            .state('sideMenu.tabs', {
                url: "/tabs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/menuContent/tabs.html"
                    }
                }
            })
            .state('sideMenu.tabs.corp', {
                url: "/corp",
                views: {
                    'tabs-corp': {
                        templateUrl: "templates/menuContent/tabs-corp/corp.html",
                        controller: 'CorpCtrl'
                    }
                }
            })
            .state('sideMenu.tabs.corp_detail', {
                url: "/corp/{corpId}",
                views: {
                    'tabs-corp': {
                        templateUrl: "templates/menuContent/tabs-corp/corp-detail.html",
                        controller: 'CorpDetailCtrl'
                    }
                }
            })
            .state('sideMenu.tabs.facts', {
                url: "/facts",
                views: {
                    'tabs-corp': {
                        templateUrl: "templates/menuContent/tabs-corp/facts.html"
                    }
                }
            })
            .state('sideMenu.tabs.facts2', {
                url: "/facts2",
                views: {
                    'tabs-corp': {
                        templateUrl: "templates/menuContent/tabs-corp/facts2.html"
                    }
                }
            })
            .state('sideMenu.tabs.about', {
                url: "/about",
                views: {
                    'tabs-about': {
                        templateUrl: "templates/menuContent/tabs-about/about.html"
                    }
                }
            })
            .state('sideMenu.tabs.navstack', {
                url: "/navstack",
                views: {
                    'tabs-about': {
                        templateUrl: "templates/menuContent/tabs-about/nav-stack.html"
                    }
                }
            })
            .state('sideMenu.tabs.contact', {
                url: "/contact",
                views: {
                    'tabs-contact': {
                        templateUrl: "templates/menuContent/tabs-contact/contact.html"
                    }
                }
            });
        $urlRouterProvider.otherwise('/sign-in');
    });
