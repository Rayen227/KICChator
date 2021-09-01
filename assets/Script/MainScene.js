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
        this.input = ""; //当前输入
        this.output = ""; //当前输出
        this.t = 0;
        this.actionQueue = [];

    },

    start() {
        this.kanban = cc.find("Canvas/Kanban").getComponent("Kanban");
        this.historyLabel = cc.find("Canvas/History/view/content/item").getComponent(cc.RichText);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);

        this.setTimer();


    },

    setTimer() {
        var self = this;
        setInterval(function () {
            self.t++;
            for (var i = 0; i < self.actionQueue.length; i++) {
                var a = self.actionQueue[i];
                a.d--;
                if (a.d <= 0) {
                    a.f(a.p);
                    self.actionQueue.splice(i, 1);
                    i--;
                } else {
                    return;
                }
            }
        }, 1000);
    },

    send() {

        var backT = 7;//说话7s后回到正常状态

        // console.log("Send");
        // console.log(this.Ebox[0].string);
        this.input = this.Ebox[0].string;

        if (!this._isValidInput(this.input)) {
            this.kanban.changeMotion("ERROR");
            console.log("输入不合法");
            return;
        }

        //网络模块
        this.output = this.input + "的回答";
        this.netStatus = true;

        this.kanban.changeMotion("SPEAK");
        var self = this;
        this._addAction(function () {
            self.kanban.changeMotion("IDLE");
        }, backT, {});

        this._addHistory(this.input, this.output);

        this.Ebox[0].string = "";


    },


    //录音，需要跨平台
    recordAudio() {

    },

    // update(dt) {

    // },


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



});
