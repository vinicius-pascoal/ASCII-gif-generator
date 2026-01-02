/**
 * Converte frames de GIF em ASCII art
 */

// Caracteres ASCII ordenados por densidade (do mais claro ao mais escuro)
const ASCII_CHARS = ' .:-=+*#%@';

export interface AsciiFrame {
  ascii: string;
  delay: number;
}

export interface ConversionOptions {
  width?: number;
  chars?: string;
  invert?: boolean;
}

/**
 * Converte uma ImageData em ASCII art
 */
export function imageDataToAscii(
  imageData: ImageData,
  options: ConversionOptions = {}
): string {
  const {
    width = 80,
    chars = ASCII_CHARS,
    invert = false
  } = options;

  const { width: imgWidth, height: imgHeight, data } = imageData;

  // Calcula a altura proporcional mantendo aspect ratio
  const aspectRatio = imgHeight / imgWidth;
  const height = Math.floor(width * aspectRatio * 0.5); // 0.5 para compensar altura dos caracteres

  const cellWidth = imgWidth / width;
  const cellHeight = imgHeight / height;

  let ascii = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calcula a posição do pixel no centro da célula
      const pixelX = Math.floor(x * cellWidth + cellWidth / 2);
      const pixelY = Math.floor(y * cellHeight + cellHeight / 2);
      const pixelIndex = (pixelY * imgWidth + pixelX) * 4;

      // Pega os valores RGB
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const a = data[pixelIndex + 3];

      // Calcula o brilho (0-255)
      const brightness = (r + g + b) / 3;

      // Aplica transparência
      const adjustedBrightness = (brightness * a) / 255;

      // Mapeia o brilho para um caractere ASCII
      const charIndex = Math.floor(
        (adjustedBrightness / 255) * (chars.length - 1)
      );

      const char = chars[invert ? chars.length - 1 - charIndex : charIndex];
      ascii += char;
    }
    ascii += '\n';
  }

  return ascii;
}

/**
 * Cria um canvas com texto ASCII renderizado
 */
export function asciiToCanvas(
  ascii: string,
  fontSize: number = 10,
  fontFamily: string = 'monospace',
  textColor: string = '#00ff00',
  backgroundColor: string = '#000000'
): HTMLCanvasElement {
  const lines = ascii.split('\n').filter(line => line.length > 0);
  const width = lines[0].length;
  const height = lines.length;

  const charWidth = fontSize * 0.6;
  const charHeight = fontSize;

  const canvas = document.createElement('canvas');
  canvas.width = width * charWidth;
  canvas.height = height * charHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Preenche o fundo
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Configura o texto
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  // Desenha cada linha
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      ctx.fillText(line[x], x * charWidth, y * charHeight);
    }
  });

  return canvas;
}

/**
 * Converte um array de frames ASCII em ImageData para criar um GIF
 */
export function asciiFrameToImageData(
  ascii: string,
  fontSize: number = 10,
  textColor: string = '#00ff00',
  backgroundColor: string = '#000000'
): ImageData {
  const canvas = asciiToCanvas(ascii, fontSize, 'monospace', textColor, backgroundColor);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
