import Live2dView from "./LAppView";

import { Live2DCubismFramework as live2dcubismframework, Option as Csm_Option, Option } from "../CubismSdkForWeb/Framework/live2dcubismframework";
import { Live2DCubismFramework as cubismMatrix44 } from "../CubismSdkForWeb/Framework/math/cubismmatrix44";
import Live2dTextureManager from "./LAppTextureManager";
import Live2dModelManager from "./LAppModelManager";
import Live2dPlatform from "./LAppPlatform";
import Live2dDefine from "./LAppDefine";
import Live2dModel from "./LAppModel";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export default class Live2dDelegate {
    private _width: number = 0
    private _height: number = 0
    private _gl: WebGLRenderingContext = null

    public scale: number = 1
    public loopIdelMotion: boolean = true

    get width(): number { return this._width }
    get height(): number { return this._height }
    get gl(): WebGLRenderingContext { return this._gl }

    public get textureManager(): Live2dTextureManager { return this._texMgr }
    public get frameBuffer(): WebGLFramebuffer { return this._frameBuffer }

    private _view: Live2dView = null
    private _texMgr: Live2dTextureManager = null
    private _frameBuffer: WebGLFramebuffer = null
    private _cubismOption: Option

    constructor(gl: WebGLRenderingContext, width: number, height: number, frameBuffer: WebGLFramebuffer) {
        this._gl = gl
        this._width = width
        this._height = height
        this._frameBuffer = frameBuffer

        //gl.enable(gl.BLEND)
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        this._view = new Live2dView(this)
        this._texMgr = new Live2dTextureManager(this)

        this._view.initialize()
        this.initializeCubism()
    }

    public loadModel(name: string) {
        Live2dModelManager.getInstance().loadModel(name)
    }
    public getModel(index: number): Live2dModel {
        return Live2dModelManager.getInstance().getModel(0)
    }

    public onFinishMotion: (model: Live2dModel) => boolean  //??????????????????Idel??????s

    //============================================================================================================================
    private initializeCubism(): void {
        // setup cubism
        this._cubismOption = new Option()
        this._cubismOption.logFunction = Live2dPlatform.printMessage;
        this._cubismOption.loggingLevel = Live2dDefine.CubismLoggingLevel;
        live2dcubismframework.CubismFramework.startUp(this._cubismOption);

        // initialize cubism
        live2dcubismframework.CubismFramework.initialize();

        // load model
        Live2dModelManager.getInstance().setApp(this)

        // default proj
        let projection: cubismMatrix44.CubismMatrix44 = new cubismMatrix44.CubismMatrix44();

        Live2dPlatform.updateTime();

        this._view.initializeSprite();
    }

    public createShader(): WebGLProgram {
        // ???????????????????????????????????????????????????

        let gl = this.gl

        let vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

        if (vertexShaderId == null) {
            console.error("failed to create vertexShader");
            return null;
        }

        const vertexShader: string =
            "precision mediump float;" +
            "attribute vec3 position;" +
            "attribute vec2 uv;" +
            "varying vec2 vuv;" +
            "void main(void)" +
            "{" +
            "   gl_Position = vec4(position, 1.0);" +
            "   vuv = uv;" +
            "}";

        gl.shaderSource(vertexShaderId, vertexShader);
        gl.compileShader(vertexShaderId);

        // ????????????????????????????????????????????????
        let fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);

        if (fragmentShaderId == null) {
            console.error("failed to create fragmentShader");
            return null;
        }

        const fragmentShader: string =
            "precision mediump float;" +
            "varying vec2 vuv;" +
            "uniform sampler2D texture;" +
            "void main(void)" +
            "{" +
            "   gl_FragColor = texture2D(texture, vuv);" +
            "}";

        gl.shaderSource(fragmentShaderId, fragmentShader);
        gl.compileShader(fragmentShaderId);

        // ??????????????????????????????????????????
        let programId = gl.createProgram();
        gl.attachShader(programId, vertexShaderId);
        gl.attachShader(programId, fragmentShaderId);

        gl.deleteShader(vertexShaderId);
        gl.deleteShader(fragmentShaderId);

        // ?????????
        gl.linkProgram(programId);

        gl.useProgram(programId);

        return programId;
    }

    public loop(): void {
        if (!this._view) {
            return
        }
        // ????????????????????????????????????
        let gl = this.gl
        // ????????????
        Live2dPlatform.updateTime();

        if (this._frameBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            //gl.viewport(0, 0, this.width, this.height);
            //gl.clearColor(0, 0, 0, 1.0);   // clear to blue
            //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // ??????????????????
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        // ???????????????????????????
        gl.enable(gl.DEPTH_TEST);

        // ???????????????????????????????????????????????????????????????
        gl.depthFunc(gl.LEQUAL);

        // ????????????????????????????????????????????????????????????
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.clearDepth(1.0);

        // ????????????
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // ????????????
        this._view.render();

        if (this._frameBuffer) {
            //TIPS: Live2d???render??????????????????Framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

    public release(): void {
        if (this._texMgr) {
            this._texMgr.release();
            this._texMgr = null;
        }

        if (this._view) {
            this._view.release();
            this._view = null;
        }

        // ?????????????????????
        Live2dModelManager.releaseInstance();

        // Cubism SDK?????????
        live2dcubismframework.CubismFramework.dispose();
    }
}
