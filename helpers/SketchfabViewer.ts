import Sketchfab from '@sketchfab/viewer-api';

interface CameraLookAt {
  position: number[];
  target: number[];
}

interface Api {
  addTexture: any;
  setMaterial: any;
  getSceneGraph: any;
  getMaterialList: any;
  addEventListener: any;
  getTextureList: any;
  getCameraLookAt: any;
  setCameraLookAt: any;
  start: any;
  hide: any;
  show: any;
  getScreenShot: (callback: any) => void;
}

class SketchfabViewer {
  private status: string = "";
  private api: Api | null = null;
  private defaultCamera: CameraLookAt = {} as CameraLookAt;
  private GAMMA: number = 2.4;

  constructor(
    private iframe: HTMLElement,
    private uid: string,
    private params: object = {},
    private loadedCallback: () => void
  ) {
    const client = new Sketchfab(iframe);
    const defaultParams = {
      graph_optimizer: 0,
      ui_infos: 0,
      ui_watermark: 0,
      ui_ar: 1,
      ui_controls: 0,
      ui_stop: 0
    };
    console.log("init");
    client.init(uid, {
      ...defaultParams,
      success: this.onSuccess.bind(this),
      error: (err: string) => (this.status = err)
    });
  }

  public screenshot(): Promise<[Error, string]> {
    console.log("camera valus is:" + this.defaultCamera);
    this.api!.setCameraLookAt(
      this.defaultCamera.position,
      this.defaultCamera.target
    );
    return new Promise((resolve, reject) => {
      this.api!.getScreenShot((err: Error, result: string) => {
        resolve([err, result]);
      });
    });
  }

  private onSuccess(api: Api) {
    this.api = api;
    api.addEventListener("viewerready", async () => {
      try {
        this.defaultCamera = await new Promise((resolve, reject) =>
          this.api!.getCameraLookAt((err: string, camera: CameraLookAt) =>
            err ? reject(err) : resolve((this.defaultCamera = camera))
          )
        );
        this.loadedCallback();
      } catch (e) {
        this.status = e as string;
      }
    });
    api.start();
  }
}

export { SketchfabViewer };
