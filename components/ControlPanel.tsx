'use client';

import { useState } from 'react';

interface ControlPanelProps {
  onConvert: (settings: ConversionSettings) => void;
  onDownload: () => void;
  isConverting: boolean;
  isDownloading?: boolean;
  hasPreview: boolean;
}

export interface ConversionSettings {
  width: number;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  invert: boolean;
  speed: number;
}

export default function ControlPanel({
  onConvert,
  onDownload,
  isConverting,
  isDownloading = false,
  hasPreview
}: ControlPanelProps) {
  const [width, setWidth] = useState(100);
  const [fontSize, setFontSize] = useState(6);
  const [textColor, setTextColor] = useState('#00ff00');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [invert, setInvert] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const handleConvert = () => {
    onConvert({
      width,
      fontSize,
      textColor,
      backgroundColor,
      invert,
      speed
    });
  };

  return (
    <div className="w-full space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Configurações
      </h2>

      <div className="space-y-4">
        {/* Largura ASCII */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Largura (caracteres): {width}
          </label>
          <input
            type="range"
            min="40"
            max="200"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Tamanho da fonte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamanho da fonte: {fontSize}px
          </label>
          <input
            type="range"
            min="4"
            max="12"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Cor do texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor do texto
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Cor de fundo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor de fundo
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Inverter cores */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="invert"
            checked={invert}
            onChange={(e) => setInvert(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="invert" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Inverter brilho
          </label>
        </div>

        {/* Velocidade do GIF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Velocidade do GIF: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Mais lento (0.25x)</span>
            <span>Normal (1x)</span>
            <span>Mais rápido (3x)</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleConvert}
          disabled={isConverting || isDownloading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isConverting ? 'Convertendo...' : 'Converter para ASCII'}
        </button>

        <button
          onClick={onDownload}
          disabled={!hasPreview || isConverting || isDownloading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isDownloading ? 'Gerando GIF...' : 'Baixar GIF ASCII'}
        </button>
      </div>
    </div>
  );
}
