'use client';

import { useState } from 'react';

interface ControlPanelProps {
  onConvert: (settings: ConversionSettings) => void;
  onDownload: () => void;
  onCopy?: () => void;
  isConverting: boolean;
  isDownloading?: boolean;
  isCopying?: boolean;
  hasPreview: boolean;
  canCopy?: boolean;
  asciiLength?: number;
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
  onCopy,
  isConverting,
  isDownloading = false,
  isCopying = false,
  hasPreview,
  canCopy = false,
  asciiLength = 0
}: ControlPanelProps) {
  const [width, setWidth] = useState(100);
  const [fontSize, setFontSize] = useState(6);
  const [textColor, setTextColor] = useState('#00ff00');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [invert, setInvert] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  // Limites de caracteres
  const LIMITS = {
    whatsapp: 65536,
    discord: 2000,
    discordNitro: 4000
  };

  // Calcula qual plataforma suporta o tamanho atual
  const getPlatformStatus = () => {
    if (asciiLength === 0) return null;

    return {
      whatsapp: asciiLength <= LIMITS.whatsapp,
      discord: asciiLength <= LIMITS.discord,
      discordNitro: asciiLength <= LIMITS.discordNitro
    };
  };

  const platformStatus = getPlatformStatus();

  // Função para sugerir largura ideal
  const suggestWidth = (targetLimit: number) => {
    if (asciiLength === 0) return;

    // Calcula proporção aproximada
    const ratio = targetLimit / asciiLength;
    const suggestedWidth = Math.floor(width * Math.sqrt(ratio) * 0.9); // 0.9 para margem de segurança

    if (suggestedWidth >= 20 && suggestedWidth <= 200) {
      setWidth(suggestedWidth);
    } else if (suggestedWidth < 20) {
      setWidth(20);
    } else {
      setWidth(200);
    }
  };

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
    <div className="w-full space-y-6 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.3)] backdrop-blur-sm">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        ⚙️ Configurações
      </h2>

      <div className="space-y-4">
        {/* Largura ASCII */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Largura (caracteres): {width}
          </label>
          <input
            type="range"
            min="20"
            max="200"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Status de Plataformas */}
        {platformStatus && (
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-green-500/30 rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <span className="text-xl">📱</span>
              Compatibilidade de Plataformas
            </h3>

            {/* Contador de caracteres */}
            <div className="text-sm text-gray-200 bg-gray-600/80 rounded-lg p-3 font-medium border border-cyan-500/20">
              📊 Tamanho atual: <span className="font-mono font-bold text-cyan-400">{asciiLength.toLocaleString()}</span> caracteres
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  {platformStatus.whatsapp ? (
                    <span className="text-green-500 text-sm font-semibold">✓ Cabe</span>
                  ) : (
                    <>
                      <span className="text-red-500 text-sm font-semibold">✗ Grande demais</span>
                      <button
                        onClick={() => suggestWidth(LIMITS.whatsapp)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Ajustar
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 pl-7">
                ⚠️ Largura recomendada: 60 (mobile) ou 80 (desktop)
              </p>
            </div>

            {/* Discord */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Discord</span>
              </div>
              <div className="flex items-center gap-2">
                {platformStatus.discord ? (
                  <span className="text-green-500 text-sm font-semibold">✓ Cabe</span>
                ) : (
                  <>
                    <span className="text-red-500 text-sm font-semibold">✗ Grande demais</span>
                    <button
                      onClick={() => suggestWidth(LIMITS.discord)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Ajustar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Discord Nitro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Discord Nitro</span>
              </div>
              <div className="flex items-center gap-2">
                {platformStatus.discordNitro ? (
                  <span className="text-green-500 text-sm font-semibold">✓ Cabe</span>
                ) : (
                  <>
                    <span className="text-red-500 text-sm font-semibold">✗ Grande demais</span>
                    <button
                      onClick={() => suggestWidth(LIMITS.discordNitro)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Ajustar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Presets rápidos */}
            <div className="pt-3 border-t-2 border-cyan-500/30">
              <p className="text-sm font-semibold text-gray-300 mb-3">⚡ Presets rápidos:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWidth(35)}
                  className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  Discord (35)
                </button>
                <button
                  onClick={() => setWidth(50)}
                  className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  Discord Nitro (50)
                </button>
                <button
                  onClick={() => setWidth(60)}
                  className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  WhatsApp Mobile (60)
                </button>
                <button
                  onClick={() => setWidth(80)}
                  className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  WhatsApp Desktop (80)
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 italic bg-cyan-500/10 rounded-lg p-2 border border-cyan-500/20">
                💡 WhatsApp quebra linhas por largura de tela. Use valores menores para mobile.
              </p>
            </div>
          </div>
        )}

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
          className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
        >
          {isConverting ? '⚡ Convertendo...' : '🎨 Converter para ASCII'}
        </button>

        <button
          onClick={onDownload}
          disabled={!hasPreview || isConverting || isDownloading}
          className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
        >
          {isDownloading ? '📦 Gerando...' : '💾 Baixar'}
        </button>
      </div>

      {/* Botão Copiar ASCII */}
      {canCopy && onCopy && (
        <div>
          <button
            onClick={onCopy}
            disabled={!hasPreview || isCopying}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] flex items-center justify-center gap-3"
          >
            {isCopying ? (
              <>
                <span className="text-2xl">✓</span>
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <span className="text-2xl">📋</span>
                <span>Copiar ASCII (Ctrl+C)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
