﻿var Funbit;
(function (Funbit) {
    (function (Ets) {
        (function (Telemetry) {
            var Configuration = (function () {
                function Configuration() {
                    var _this = this;
                    this.initialized = $.Deferred();
                    this.skins = [];

                    // initialize structures
                    if (!Configuration.isCordovaAvailable()) {
                        this.insomnia = {
                            keepAwake: function () {
                            }
                        };
                        this.prefs = {
                            fetch: function () {
                            },
                            store: function () {
                            }
                        };
                    } else {
                        this.insomnia = plugins.insomnia;
                        this.prefs = plugins.appPreferences;

                        // turn off sleep mode
                        this.insomnia.keepAwake();
                    }

                    // if server IP was passed in the query string use it then
                    var ip = Configuration.getParameter('ip');
                    if (ip) {
                        this.serverIp = ip;
                        this.initialized.resolve(this);
                        return;
                    }
                    this.serverIp = '';
                    if (!Configuration.isCordovaAvailable()) {
                        // if cordova is not available then
                        // we are in desktop environment
                        // so we use current host name as our IP
                        this.serverIp = window.location.hostname;
                        this.initialized.resolve(this);
                    } else {
                        this.prefs.fetch(function (savedIp) {
                            _this.serverIp = savedIp;
                            _this.initialized.resolve(_this);
                        }, function () {
                            _this.initialized.resolve(_this);
                        }, 'serverIp');
                    }
                }
                Configuration.getInstance = function () {
                    if (!Configuration.instance) {
                        Configuration.instance = new Configuration();
                        Configuration.instance.reload(Configuration.instance.serverIp);
                    }
                    return Configuration.instance;
                };

                Configuration.getParameter = function (name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
                    var results = regex.exec(location.search);
                    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                };

                Configuration.prototype.getSkinConfiguration = function () {
                    var skinName = Configuration.getParameter('skin');
                    if (skinName) {
                        for (var i = 0; i < this.skins.length; i++) {
                            if (this.skins[i].name == skinName)
                                return this.skins[i];
                        }
                    }
                    return null;
                };

                Configuration.prototype.reload = function (newServerIp, done, fail) {
                    var _this = this;
                    if (typeof done === "undefined") { done = null; }
                    if (typeof fail === "undefined") { fail = null; }
                    if (!newServerIp)
                        return;
                    this.serverIp = newServerIp;
                    $.ajax({
                        url: this.getUrlInternal('/config.json'),
                        async: (done != null),
                        cache: true,
                        dataType: 'json',
                        timeout: 5000
                    }).done(function (json) {
                        _this.prefs.store(function () {
                        }, function () {
                        }, 'serverIp', _this.serverIp);
                        _this.skins = json.skins;
                        if (done)
                            done();
                    }).fail(function () {
                        _this.skins = [];
                        if (fail)
                            fail();
                    });
                };

                Configuration.isCordovaAvailable = function () {
                    return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
                };

                Configuration.prototype.getUrlInternal = function (path) {
                    var serverPort = 25555;
                    return "http://" + this.serverIp + ":" + serverPort + path;
                };

                Configuration.getUrl = function (path) {
                    return Configuration.getInstance().getUrlInternal(path);
                };
                return Configuration;
            })();
            Telemetry.Configuration = Configuration;
        })(Ets.Telemetry || (Ets.Telemetry = {}));
        var Telemetry = Ets.Telemetry;
    })(Funbit.Ets || (Funbit.Ets = {}));
    var Ets = Funbit.Ets;
})(Funbit || (Funbit = {}));
//# sourceMappingURL=config.js.map
