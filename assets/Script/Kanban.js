import Live2dComponent from "../components/live2d/Live2dComponent";
import Live2dDefine from "../components/live2d/src/LAppDefine";
import Live2dModel from "../components/live2d/src/LAppModel";

cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor() {

        this.modelName = "Hiyori";

        this.motionMode = {
            "Hiyori": {
                "SPEAK": [3, 4, 6],
                "IDLE": [0, 1, 2],
                "ERROR": [5, 7]
            },
            "Natori": {//待修改
                "SPEAK": [3, 4, 6],
                "IDLE": [0, 1, 2],
                "ERROR": [5, 7]
            }
        }


        this.cnt = 0; //动作切换次数，保证新动作优先级高于原动作
    },
    start() {
        var self = this;

        //暂时无法更换人物
        // this.changeModel("Hiyori");
        // this.changeModel("Natori");
    },

    _getMotionMode(m) {
        if (!m) {
            console.error("_getMotionMode param m is null");
            return;
        }

        var ran = Math.round(Math.random() * (this.motionMode[this.modelName][m].length - 1));

        return this.motionMode[this.modelName][m][ran];
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

        if (this.cnt == 0) {//用于弥补首次切换动作不生效问题，原因不明
            this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle,
                this._getMotionMode(m), this.cnt++);
        }

        this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(Live2dDefine.MotionGroupIdle,
            this._getMotionMode(m), this.cnt++);

    },

    changeModel(m) {
        if (!m) {
            console.error("changeModel param m is null");
            return;
        }

        this.modelName = m;
        this.getComponent(Live2dComponent).live2d.loadModel(m);
        this.getComponent(Live2dComponent).loopIdelMotion = false;

    },
});
