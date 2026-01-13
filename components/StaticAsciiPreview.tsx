'use client';

import { useEffect, useRef } from 'react';

interface StaticAsciiPreviewProps {
  ascii: string;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
}

export default function StaticAsciiPreview({
  ascii,
  fontSize = 10,
  textColor = '#00ff00',
  backgroundColor = '#000000'
}: StaticAsciiPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !ascii) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines = ascii.split('\n').filter(line => line.length > 0);
    const width = lines[0].length;
    const height = lines.length;

    const charWidth = fontSize * 0.6;
    const charHeight = fontSize;

    canvas.width = width * charWidth;
    canvas.height = height * charHeight;

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
  }, [ascii, fontSize, textColor, backgroundColor]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="overflow-auto max-h-150">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
