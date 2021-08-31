var net = require("NetModel.js");

cc.Class({
    extends: cc.Component,

    properties: {
        Ebox: {
            default: [],
            type: cc.EditBox
        },

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ctor() {

        this.history = [
            // { "input": "", "output": "" },
        ]; //对话历史
        this.input = ""; //当前输入
        this.output = ""; //当前输出

    },

    start() {
        this.kanban = cc.find("Canvas/Kanban").getComponent("Kanban");
        // this.text = cc.find("Canvas/Buble").getComponent("Buble");
        // this.ebox = cc.find("Canvas/Down").getComponentInChildren(cc.EditBox);//
        // this.sendButton = cc.find("Canvas/Down/Send");
        this.historyLabel = cc.find("Canvas/History/view/content/item").getComponent(cc.RichText);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
    },

    button() {

        this.kanban.changeMotion("SPEAK");
        // this.text.setText("<color=fff><b>Speaking</b></color>");

    },

    send() {
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

        this.kanban.changeMotion("SPEAK");

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

        // for (var i = 0; i < this.history.length; i++) {
        //     var item = this.history[i];

        //     this.history.string = 
        // }
        this.historyLabel.string = "<size=24px>" + "<color=gray>" + this.input + "</color>" + "\n\t" + this.output + "\n" + "</size>" + this.historyLabel.string;
        // this.historyLabel.string = "???"
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

});
