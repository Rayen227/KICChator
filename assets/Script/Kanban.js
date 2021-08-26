import Live2dComponent from "../components/live2d/Live2dComponent";
import Live2dDefine from "../components/live2d/src/LAppDefine";
import Live2dModel from "../components/live2d/src/LAppModel";

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
        this.SPEAKMode = [3, 4, 6];
        this.IDLEMode = [0, 1, 2];

        this.cnt = 0;
    },
    start() {
        var self = this;
        // this.getComponent(Live2dComponent).live2d.loadModel("Hiyori")
        this.getComponent(Live2dComponent).loopIdelMotion = false;
        // this.cnt = 0;
        // cc.find("Canvas/button").on(cc.Node.EventType.MOUSE_DOWN, function () {
        //     self.
        // });
    },

    _getMotionMode(m) {
        if (!m) {
            console.error("_getMotionMode param m is null");
            return;
        }

        var ran = Math.round(Math.random() * 2);
        console.log(this.SPEAKMode[ran]);

        if (m == "SPEAK") {
            return this.SPEAKMode[ran];
        }
        else if (m == "IDLE") {
            return this.IDLEMode[ran];
        }

    },

    /**
     * @description 未知错误的弥补手段
     * @param {number} m 错误编号 1:live2d首次切换Motion不生效, 
     * 
     */
    _unkownErrorFixer(m) {
        if (m == 1) {

        }
    },

    /**
     * @description 切换人物动作
     * @param m String,"SPEAK", "IDLE"
     */
    changeMotion(m) {

        if (!m) {
            console.error("changeMotion param m is null");
            return;
        }

        if (this.cnt == 0) {
            this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle,
                this._getMotionMode(m), this.cnt++);
        }

        this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle,
            this._getMotionMode(m), this.cnt++);

    },



    // button() {
    //     // this.getComponent(Live2dComponent).live2d.getModel(0).startRandomMotion(Live2dDefine.MotionGroupIdle, Live2dDefine.PriorityIdle);
    //     // this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle, this.cnt++, this.cnt);
    //     // console.log(this.cnt - 1);

    //     this.changeMotion("SPEAK");
    // }

    // update (dt) {},
});
