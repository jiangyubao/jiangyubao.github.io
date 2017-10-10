/**
 * model对象声明
 */
var model = {};

model.chat = {};
model.chat.output = '';
model.chat.input = '你好，中文';
model.chat.groups = 'gs01,gs02';
model.chat.roomName = 'chat_room_001';
/**
 * App声明
 */
var chatApp = angular.module("chatApp", ['wsApp']);
chatApp.controller(
    "chatCtrl",
    function ($scope, wsSvc, $log, $timeout, $http) {
        $scope.model = model;
        $scope.model.chat.addr = "ws03.itou.com:9092"
        $scope.join = function () {
            wsSvc.connect("ws://" + $scope.model.chat.addr + "/websocket",
                function (event) {
                    wsSvc.send("{\"rt\":\"chat_1.0.0\",\"act\":\"jrq\",\"rn\":\"" + model.chat.roomName + "\",\"gs\":\"" + model.chat.groups + "\",\"at\":\"access_token_xxx\"}");
                },
                function (event) {
                    $log.info(event);
                    var response = angular
                        .fromJson(event.data);
                    if (angular.isDefined(response.act)
                        && response.act == 'brq') {
                        if (angular.isDefined(response.sts) && angular.isDefined(response.bts) && angular.isDefined(response.rts)) {
                            $scope.logTime(response);
                        }
                        $timeout(
                            function () {
                                model.chat.output += response.js.msg + "\n";
                                $log.info(model.chat.output);
                            }, 0);
                    }
                }, function (event) {
                });

        };
        $scope.logTime = function (response) {
            var st = new Date();
            st.setTime(parseInt(response.sts));
            var bts = new Date();
            bts.setTime(parseInt(response.bts));
            var rts = new Date();
            rts.setTime(parseInt(response.rts));
            var nt = new Date().getTime();
            var wsRecvTime = bts - st;
            var pubsubTime = rts - bts;
            var jsRecvTime = nt - rts;
            var totalTime = nt - st;
            var log = "耗时统计：接收: " + wsRecvTime + "；PUB/SUB：" + pubsubTime + "；JS订阅：" + jsRecvTime + "；总：" + totalTime;
            $log.info(log);
        };
        $scope.leave = function () {
            wsSvc.send("{\"rt\":\"chat_1.0.0\",\"act\":\"lrq\",\"rn\":\"" + model.chat.roomName + "\"}");
        };
        $scope.heartbeat = function () {
            wsSvc.send("{\"rt\":\"chat_1.0.0\",\"act\":\"hrq\"}");
        };
        $scope.wsSend = function () {
            wsSvc.send("{\"rt\":\"chat_1.0.0\",\"sts\":"
                + (new Date().getTime())
                + ",\"act\":\"srq\",\"rn\":\"" + model.chat.roomName + "\",\"gs\":\"" + model.chat.groups + "\",\"js\":{\"msg\":\""
                + model.chat.input + "\"}}");
        };
        $scope.httpSend = function () {
            var srq = {
                "rt": "chat_1.0.0",
                "sts": new Date().getTime(),
                "act": "srq",
                "rn": model.chat.roomName,
                "gs": model.chat.groups,
                "js": {
                    "msg": model.chat.input
                }
            };
            $log.info(srq);
            $scope.model.httpAddr = "http://" + $scope.model.chat.addr + "/chat/api/v1/chat/srq";
            $http.post($scope.model.httpAddr, srq, {}).success(function (data) {
                $log.info(data);
            }).error(function (data, status, headers, config) {
                $log.info(data, status, headers, config);
            });
        };
        $scope.httpSendLocalHost = function () {
            $log.info("httpSendLocalHost");
            $http.get("https://127.0.0.1:9000?routes").success(function (data) {
                $log.info(data);
            }).error(function (data, status, headers, config) {
                $log.info(data, status, headers, config);
            });
        };
    });
