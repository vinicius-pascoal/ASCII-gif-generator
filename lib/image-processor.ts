/**
 * Processa imagens estáticas para conversão ASCII
 */

import { imageDataToAscii } from './ascii-converter';

/**
 * Lê um arquivo de imagem e retorna ImageData
 */
export async function parseImageFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Cria um canvas para extrair os dados da imagem
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Desenha a imagem no canvas
      ctx.drawImage(img, 0, 0);

      // Extrai ImageData
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Limpa a URL
      URL.revokeObjectURL(url);

      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Converte uma imagem em ASCII
 */
export async function convertImageToAscii(
  file: File,
  width: number = 80,
  invert: boolean = false
): Promise<string> {
  const imageData = await parseImageFile(file);
  return imageDataToAscii(imageData, { width, invert });
}

/**
 * Exporta ASCII como imagem PNG
 */
export function exportAsciiToPng(
  ascii: string,
  fontSize: number = 10,
  textColor: string = '#00ff00',
  backgroundColor: string = '#000000',
  filename: string = 'ascii-art.png'
): void {
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
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = 'top';

  // Desenha cada linha
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      ctx.fillText(line[x], x * charWidth, y * charHeight);
    }
  });

  // Converte canvas para blob e baixa
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error('Failed to create blob from canvas');
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
