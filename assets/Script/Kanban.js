import Live2dComponent from "../components/live2d/Live2dComponent";
import Live2dDefine from "../components/live2d/src/LAppDefine";
import Live2dModel from "../components/live2d/src/LAppModel";

cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor() {

        this.modelName = "Natori";

        this.motionMode = {
            "Hiyori": {
                "m": "Idle",
                "SPEAK": [3, 4, 6],
                "IDLE": [0, 1, 2],
                "ERROR": [5, 7]
            },
            "Natori": {
                "m": "Tap",
                "SPEAK": [1, 2, 5],
                "IDLE": [0, 4, 6],
                "ERROR": [3, 7]
            }
        }


        this.cnt = 0; //动作切换次数，保证新动作优先级高于原动作
    },
    start() {

        //暂时仅能使用人物Hiyori,Natori
        this.changeModel(this.modelName);
        this.getComponent(Live2dComponent).loopIdelMotion = false;

    },




    /**
     * @description 切换人物动作
     * @param m String,"SPEAK", "IDLE", "ERROR"
     */
    changeMotion(m) {

        if (!m) {
            console.error("changeMotion param m is null");
            return;
        }

        var group = null;
        if (this.motionMode[this.modelName].m == "Idle") {
            group = Live2dDefine.MotionGroupIdle;
        }
        else if (this.motionMode[this.modelName].m == "Tap") {
            group = Live2dDefine.MotionGroupTapBody;
        }
        else {
            console.error("MotionGroup 错误");
            return;
        }


        if (this.cnt == 0) {//用于弥补首次切换动作不生效问题，原因不明
            this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(group,
                this._getMotionMode(m), this.cnt++);
        }

        this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(group,
            this._getMotionMode(m), this.cnt++);


        // this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(group,
        //     this.cnt, this.cnt);
        // console.log(this.cnt++);

    },

    changeModel(m) {
        if (!m) {
            console.error("changeModel param m is null");
            return;
        }

        this.modelName = m;
        this.getComponent(Live2dComponent).live2d.loadModel(m);

    },

    _getMotionMode(m) {
        if (!m) {
            console.error("_getMotionMode param m is null");
            return;
        }

        if (!this.motionMode[this.modelName]) {
            console.error("请配置模型动作");
        }
        // var ran = parseInt(Math.random() * this.motionMode[this.modelName][m].length, 10);
        // this.motionMode[this.modelName][m].push(this.motionMode[this.modelName][m].shift());

        return this.motionMode[this.modelName][m][this.cnt % this.motionMode[this.modelName][m].length];
    },
});
