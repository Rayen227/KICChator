var net = require("NetModel.js");

cc.Class({
    extends: cc.Component,

    properties: {
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
            { "input": "", "output": "" },
        ]; //对话历史
        this.input = ""; //当前输入
        this.output = ""; //当前输出

    },

    start() {
        this.kanban = cc.find("Canvas/Kanban").getComponent("Kanban");
        this.text = cc.find("Canvas/Buble").getComponent("Buble");
    },

    button() {

        this.kanban.changeMotion("SPEAK");
        this.text.setText("<color=fff><b>Speaking</b></color>");

    },

    //录音，需要跨平台
    recordAudio() {

    },

    // update (dt) {},
});
