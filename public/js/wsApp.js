/**
 * WebSocket Service定义
 */
angular.module("wsApp", []).factory("wsSvc", function ($log) {
    var webSocket;
    var connected = false;
    return {
        connect: function (uri, openHandler, messageHandler, closeHandler) {
            if (connected == true) {
                if (angular.isDefined(webSocket)) {
                    webSocket.close();
                }
                connected = false;
            }
            $log.info("uri: " + uri);
            if (!window.WebSocket) {
                window.WebSocket = window.MozWebSocket;
            }
            if (window.WebSocket) {
                webSocket = new WebSocket(uri);
                webSocket.onmessage = function (event) {
                    $log.info("WebSocket有消息: " + event);
                    messageHandler(event);
                };
                webSocket.onopen = function (event) {
                    $log.info("WebSocket连接成功: " + event);
                    connected = true;
                    openHandler(event);
                };
                webSocket.onclose = function (event) {
                    $log.info("WebSocket已关闭: " + event);
                    connected = false;
                    closeHandler(event);
                };
                $log.info("WebSocket对象创建成功");
                return true;
            }
            $log.info("浏览器不支持原生WebSocket");
            return false;
        },
        send: function (msg) {
            $log.info("WebSocket消息发送中：" + msg);
            if (connected) {
                webSocket.send(msg);
                $log.info("WebSocket消息发送成功");
                return true;
            }
            $log.info("WebSocket消息发送失败：尚未连接");
            return false;
        },
        close: function () {
            webSocket.close();
        }
    }
});
