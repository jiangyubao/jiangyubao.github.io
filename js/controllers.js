angular.module('inbox.controllers', ['ionic', 'ngCookies'])
    .constant("baseUrl", "http://localhost:9092")
    .service('Auth', function ($cookieStore) {
        var _user = $cookieStore.get('user');
        if (_user == undefined) {
            _user = {'token': ''}
        }
        return {
            setToken: function (token) {
                _user = {'token': token};
                $cookieStore.put('user', _user);
            },
            getToken: function () {
                return _user != undefined ? _user.token : '';
            },
            removeToken: function () {
                _user = null;
                $cookieStore.remove("user");
            }
        }
    })
    .config(function ($stateProvider, $httpProvider, $urlRouterProvider, baseUrl) {
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.interceptors.push(function ($location, Auth) {
            return {
                request: function (request) {
                    if (request.url.indexOf(baseUrl + '/inbox/') != -1 && Auth.getToken() != '') {
                        request.params = request.params || {};
                        console.log(Auth.getToken());
                        request.params.user_token = Auth.getToken();
                    }
                    return request;
                },
                response: function (response) {
                    if (response.config.url == baseUrl + '/inbox/open/v1/user/access/login') {
                        Auth.setToken(response.data.data.user_token);
                        console.log(Auth.getToken());
                    }
                    if (response != undefined
                        && response.data != undefined
                        && response.data.code != undefined
                        && response.data.code != '401') {
                        //如果不等于200，跳转到忘记密码
                        console.log(response);
                        $location.path('/login');
                        return response;
                    }
                    return response;
                },
                'responseError': function (rejection) {
                    // 错误处理
                    switch (rejection.status) {
                        case 401:
                            if (rejection.config.url !== '/login')
                            // 如果当前不是在登录页面
                                $location.path('/login');
                            break;
                        case 403:
                            $location.path('/login');
                            break;
                        case 404:
                            $location.path('/login');
                            break;
                        case 500:
                            $location.path('/login');
                            break;
                    }
                    return $q.reject(rejection);
                }
            }
        });
    })
    .controller('SignInCtrl', function ($scope, $stateParams, $log, $state, $http, baseUrl, Auth) {
        $scope.user = {
            "userName": "jiangyb",
            "password": "123465",
            "code": "123"
        };
        $scope.login = function (user) {
            $http.post(baseUrl + "/inbox/open/v1/user/access/login", user
            ).success(function (data) {
                }
            ).error(function (data) {
                    $log.info("登录失败");
                }
            );
        };
        $scope.logout = function () {
            $http({
                method: "POST",
                url: baseUrl + "/inbox/open/v1/user/access/logout",
                data: {}
            }).success(function (data, status, headers, config) {
                $log.info(data);
                $log.info(status);
                $log.info(headers);
                $log.info(config);
                Auth.removeToken();
            });
        };
        $scope.getToken = function () {
            $http.get(baseUrl + "/inbox/open/v1/user/access/one/122222").success(function (data) {

            });
        };

    })
    .controller('CorpCtrl', function ($scope, $ionicPopover, $ionicPopup) {
        $scope.refresh = function () {
            $scope.corps = corps.getList().$object;
        };
        $scope.itemClick = function () {
            $scope.popover.hide();
            var alertPopup = $ionicPopup.alert({
                title: '啊，，我被点击了',
                template: '浑身一震！！！'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        $ionicPopover.fromTemplateUrl('templates/menuContent/tabs-corp/popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });
    })
    .controller('CorpDetailCtrl', function ($scope, $stateParams, $log) {
        $log.info($scope.corp);
    });
