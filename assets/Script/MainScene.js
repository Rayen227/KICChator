var net = require("NetModel.js");

cc.Class({
    extends: cc.Component,

    properties: {
        Ebox: {
            default: [],
            type: cc.EditBox
        },
    },

    ctor() {

        this.netStatus = true;
        this.history = [
            // { "input": "", "output": "" },
        ]; //对话历史
        this.historyOff = true;
        this.input = ""; //当前输入
        this.output = ""; //当前输出

        this.actionQueue = [];
        this.t = 0;
        this.resetTime = 5; //动作到下一个停止动作的最短间隔,秒

    },

    start() {
        this.kanban = cc.find("Canvas/Kanban").getComponent("Kanban");
        this.historyLabel = cc.find("Canvas/History/view/content/item").getComponent(cc.RichText);
        this.historyPannel = cc.find("Canvas/History");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);

        this._setTimer();

        this.welcome();


    },

    welcome() {
        var self = this;
        this._addAction(function () {
            cc.find("Canvas/Kanban").runAction(cc.spawn(
                cc.fadeTo(0.5, 255),
                cc.scaleTo(0.5, 1, 1),
            ));
            self.kanban.setMotion("WELCOME");
            self._resetCount();
        }, 2, {});
        this._addAction(function () {
            self.kanban.setMotion("STOP");
            self._resetCount();
        }, 7, {});


    },

    //切换历史记录面板的显示状态
    showHistory() {
        var s = 0.3;

        if (this.historyOff) {
            this.historyOff = false;
            this.historyPannel.runAction(cc.spawn(
                cc.moveTo(s, cc.v2(0, 547)),
                cc.fadeTo(s, 255),
            ));
        }
        else {
            this.historyOff = true;
            this.historyPannel.runAction(cc.spawn(
                cc.moveTo(s, cc.v2(0, 667)),
                cc.fadeTo(s, 0),
            ));
        }


        this.kanban.setExpression();

    },

    send() {

        var backT = 7;//说话7s后回到正常状态

        this.input = this.Ebox[0].string;

        if (!this._isValidInput(this.input)) {
            this.kanban.setMotion("ERROR");
            this._resetCount();
            console.log("输入不合法");
            return;
        }

        //网络模块

        this.output = net.post("/text", { "sentence": this.input }, function (res) {
            console.log(res);

            // this.netStatus = true;

            // this.kanban.setMotion("SPEAK");
            // this._resetCount();
            // var self = this;
            // this._addAction(function () {
            //     if (self.t <= 0) {
            //         self.kanban.setMotion("IDLE");
            //         self._resetCount();
            //     }
            // }, backT, {});

            // this._addHistory(this.input, this.output);

            // this.Ebox[0].string = "";
        });



    },


    _onKeyDown: function (e) {
        if (e.keyCode == 13) {
            this.send();
        }
    },

    _addHistory(i, o) {
        this.history.unshift({ "input": i, "output": o });
        this.historyLabel.string = "<size=24px>" + "<color=gray>" + this.input + "</color>" + "\n\t" + this.output + "\n" + "</size>" + this.historyLabel.string;

    },

    //验证输入非空、安全
    _isValidInput(s) {

        if (s == "") {
            return false;
        }
        for (i = 0; i < s.length; i++) {
            if (s.charAt(i) == "<" || s.charAt(i) == ">" || s.charAt(i) == "'") {
                return false;
            }
        }
        return true;

    },

    _addAction(f, d, p) {
        this.actionQueue.push({ "f": f, "d": d, "p": p });
        this.actionQueue.sort(this._comp('d', true));

    },

    _comp: function (attr, rev) {
        if (rev == undefined) {
            rev = 1;
        } else {
            rev = (rev) ? 1 : -1;
        }

        return function (a, b) {
            a = a[attr];
            b = b[attr];
            if (a < b) {
                return rev * -1;
            }
            if (a > b) {
                return rev * 1;
            }
            return 0;
        }
    },

    //时间控制器，伪多线程；每1s刷新一次；
    _setTimer() {
        var self = this;
        setInterval(function () {
            self.t--;
            for (var i = 0; i < self.actionQueue.length; i++) {
                var a = self.actionQueue[i];
                a.d--;
                if (a.d <= 0) {
                    a.f(a.p);
                    self.actionQueue.splice(i, 1);
                    i--;
                }
            }
        }, 1000);
    },

    _resetCount() {
        this.t = this.resetTime;
    },

});
