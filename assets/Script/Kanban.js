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

    start() {
        var self = this;
        // this.getComponent(Live2dComponent).live2d.loadModel("Hiyori")
        this.getComponent(Live2dComponent).loopIdelMotion = false;
        this.cnt = 0;
        // cc.find("Canvas/button").on(cc.Node.EventType.MOUSE_DOWN, function () {
        //     self.
        // });
    },

    button() {
        // this.getComponent(Live2dComponent).live2d.getModel(0).startRandomMotion(Live2dDefine.MotionGroupIdle, Live2dDefine.PriorityIdle);
        this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle, this.cnt++, this.cnt);
    }

    // update (dt) {},
});
