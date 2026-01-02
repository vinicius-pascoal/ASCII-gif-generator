/**
 * Processa GIFs usando gifuct-js
 */

import { parseGIF, decompressFrames } from 'gifuct-js';
import { imageDataToAscii, asciiFrameToImageData, type AsciiFrame } from './ascii-converter';

export interface ProcessedFrame {
  imageData: ImageData;
  delay: number;
}

/**
 * Lê um arquivo GIF e retorna os frames
 */
export async function parseGifFile(file: File): Promise<ProcessedFrame[]> {
  const arrayBuffer = await file.arrayBuffer();
  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);

  // Pega as dimensões do GIF
  const gifWidth = gif.lsd.width;
  const gifHeight = gif.lsd.height;

  return frames.map(frame => {
    const { dims, patch, delay } = frame;

    // Cria um canvas para renderizar o frame completo
    const canvas = document.createElement('canvas');
    canvas.width = gifWidth;
    canvas.height = gifHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Cria ImageData do patch
    const patchData = new ImageData(
      new Uint8ClampedArray(patch),
      dims.width,
      dims.height
    );

    // Desenha o patch na posição correta
    ctx.putImageData(patchData, dims.left, dims.top);

    // Pega o frame completo
    const imageData = ctx.getImageData(0, 0, gifWidth, gifHeight);

    return {
      imageData,
      delay: delay * 10 || 100 // delay em ms
    };
  });
}

/**
 * Converte frames de GIF em ASCII frames
 */
export function convertFramesToAscii(
  frames: ProcessedFrame[],
  width: number = 80,
  invert: boolean = false
): AsciiFrame[] {
  return frames.map(frame => ({
    ascii: imageDataToAscii(frame.imageData, { width, invert }),
    delay: frame.delay
  }));
}

/**
 * Cria um GIF a partir de frames ASCII usando gif-encoder-2
 */
export async function createAsciiGif(
  asciiFrames: AsciiFrame[],
  fontSize: number = 10,
  textColor: string = '#00ff00',
  backgroundColor: string = '#000000',
  speedMultiplier: number = 1.0
): Promise<Blob> {
  // Importação dinâmica do gif-encoder-2
  const GIFEncoder = (await import('gif-encoder-2')).default;

  // Cria o primeiro frame para obter as dimensões
  const firstImageData = asciiFrameToImageData(
    asciiFrames[0].ascii,
    fontSize,
    textColor,
    backgroundColor
  );

  const width = firstImageData.width;
  const height = firstImageData.height;

  // Cria o encoder
  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0); // 0 = loop infinito
  encoder.setQuality(10); // qualidade (1-20, menor = melhor)

  // Adiciona cada frame
  for (const frame of asciiFrames) {
    const imageData = asciiFrameToImageData(
      frame.ascii,
      fontSize,
      textColor,
      backgroundColor
    );

    // Aplica o multiplicador de velocidade
    // speedMultiplier > 1 = mais rápido, < 1 = mais lento
    const adjustedDelay = Math.round(frame.delay / speedMultiplier);
    encoder.setDelay(Math.max(adjustedDelay, 1)); // Mínimo de 1ms
    encoder.addFrame(imageData.data);
  }

  encoder.finish();

  // Converte o buffer em Blob
  const buffer = encoder.out.getData();
  return new Blob([buffer], { type: 'image/gif' });
}
