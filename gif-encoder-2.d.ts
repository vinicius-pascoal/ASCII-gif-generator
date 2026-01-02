declare module 'gif-encoder-2' {
  export default class GIFEncoder {
    constructor(width: number, height: number);
    start(): void;
    setRepeat(repeat: number): void;
    setQuality(quality: number): void;
    setDelay(delay: number): void;
    addFrame(frame: Uint8ClampedArray): void;
    finish(): void;
    out: {
      getData(): Uint8Array;
    };
  }
}
