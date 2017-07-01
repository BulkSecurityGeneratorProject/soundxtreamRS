/**
 * Created by Xavi on 19/01/2017.
 */
'use strict';
angular.module('soundxtreamappApp')
    .factory('ChatWebsocketService', function ($cookies, $http, $q) {
        var stompClient = null;
        var subscriber = null;
        var listener = $q.defer();
        var connected = $q.defer();
        var alreadyConnectedOnce = false;

        return {
            connect: function (urlChat, id_chat) {
                //building absolute path so that websocket doesnt fail when deploying with a context path
                var loc = window.location;
                var url = '//' + loc.host + loc.pathname + urlChat;
                var socket = new SockJS(url);
                stompClient = Stomp.over(socket);
                //stompClient.debug = null;
                var headers = {};
                headers['X-CSRF-TOKEN'] = $cookies[$http.defaults.xsrfCookieName];
                stompClient.connect(headers, function() {
                    connected.resolve("success");
                    this.subscribe(id_chat);
                });
            },
            subscribe: function(id_chat) {
                connected.promise.then(function() {
                    subscriber = stompClient.subscribe("/topic/messages/chat/" + id_chat, function(data) {
                        listener.notify(JSON.parse(data.body));
                    });
                }, null, null);
            },
            unsubscribe: function() {
                if (subscriber != null) {
                    subscriber.unsubscribe();
                }
                listener = $q.defer();
            },
            receive: function() {
                return listener.promise;
            },
            sendMessage: function (id_chat, message) {
                if (stompClient !== null && stompClient.connected) {
                    stompClient
                        .send("/topic/sendMessage/chat/" + id_chat,
                            {},
                            angular.toJson(message));
                }
            },
            disconnect: function() {
                if (stompClient != null) {
                    stompClient.disconnect();
                    stompClient = null;
                }
            }
        };

    });
