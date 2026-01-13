'use client';

import { useState, useEffect } from 'react';
import GifUploader from '@/components/GifUploader';
import ImageUploader from '@/components/ImageUploader';
import AsciiPreview from '@/components/AsciiPreview';
import StaticAsciiPreview from '@/components/StaticAsciiPreview';
import ControlPanel, { type ConversionSettings } from '@/components/ControlPanel';
import { parseGifFile, convertFramesToAscii, createAsciiGif } from '@/lib/gif-processor';
import { convertImageToAscii, exportAsciiToPng } from '@/lib/image-processor';
import type { AsciiFrame } from '@/lib/ascii-converter';

type Mode = 'gif' | 'image';

export default function Home() {
  const [mode, setMode] = useState<Mode>('gif');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [asciiFrames, setAsciiFrames] = useState<AsciiFrame[]>([]);
  const [staticAscii, setStaticAscii] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<ConversionSettings | null>(null);

  // Atalho de teclado Ctrl+C para copiar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica se Ctrl+C foi pressionado e há ASCII para copiar
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // Verifica se não está em um input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          // Se há ASCII disponível, copia
          if ((mode === 'image' && staticAscii) || (mode === 'gif' && asciiFrames.length > 0)) {
            e.preventDefault();
            handleCopy();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, staticAscii, asciiFrames]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setAsciiFrames([]);
    setStaticAscii('');
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedFile(null);
    setOriginalPreview('');
    setAsciiFrames([]);
    setStaticAscii('');
    setCurrentSettings(null);
  };

  const handleConvert = async (settings: ConversionSettings) => {
    if (!selectedFile) return;

    setIsConverting(true);
    setCurrentSettings(settings);

    try {
      if (mode === 'gif') {
        // Parse o GIF
        const frames = await parseGifFile(selectedFile);

        // Converte para ASCII
        const ascii = convertFramesToAscii(frames, settings.width, settings.invert);

        setAsciiFrames(ascii);
        setStaticAscii('');
      } else {
        // Converte imagem estática para ASCII
        const ascii = await convertImageToAscii(selectedFile, settings.width, settings.invert);

        setStaticAscii(ascii);
        setAsciiFrames([]);
      }
    } catch (error) {
      console.error('Erro ao converter:', error);
      alert(`Erro ao converter ${mode === 'gif' ? 'o GIF' : 'a imagem'}. Tente outro arquivo.`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!currentSettings) return;

    setIsDownloading(true);
    try {
      if (mode === 'gif' && asciiFrames.length > 0) {
        // Cria o GIF ASCII
        const blob = await createAsciiGif(
          asciiFrames,
          currentSettings.fontSize,
          currentSettings.textColor,
          currentSettings.backgroundColor,
          currentSettings.speed
        );

        // Baixa o arquivo
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-${selectedFile?.name || 'output.gif'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (mode === 'image' && staticAscii) {
        // Exporta PNG
        exportAsciiToPng(
          staticAscii,
          currentSettings.fontSize,
          currentSettings.textColor,
          currentSettings.backgroundColor,
          `ascii-${selectedFile?.name.replace(/\.[^/.]+$/, '') || 'output'}.png`
        );
      }
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
      alert('Erro ao criar o arquivo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (!staticAscii && asciiFrames.length === 0) return;

    setIsCopying(true);
    try {
      // Para imagens estáticas, copia o ASCII diretamente
      if (mode === 'image' && staticAscii) {
        await navigator.clipboard.writeText(staticAscii);
      }
      // Para GIFs, copia o primeiro frame
      else if (mode === 'gif' && asciiFrames.length > 0) {
        await navigator.clipboard.writeText(asciiFrames[0].ascii);
      }

      // Mantém o estado "Copiado!" por 2 segundos
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar o ASCII. Tente novamente.');
      setIsCopying(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#3F3F3F]">
      {/* Background SVG Pattern */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: "url('/fundo.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px'
        }}
      />

      {/* Overlay com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50" />

      {/* Background decorativo com cores coerentes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 dark:bg-cyan-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-green-500 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-4 animate-gradient drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            ASCII Art Converter
          </h1>
          <p className="text-xl text-gray-300 font-medium drop-shadow-lg">
            Transforme GIFs e imagens em arte ASCII
          </p>
        </header>

        {/* Mode Selector */}
        {!selectedFile && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border-2 border-cyan-500/30 p-1.5 bg-gray-800/90 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <button
                onClick={() => handleModeChange('gif')}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'gif'
                  ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400'
                  }`}
              >
                🎬 GIF
              </button>
              <button
                onClick={() => handleModeChange('image')}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'image'
                  ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400'
                  }`}
              >
                🖼️ Imagem
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!selectedFile && (
          <div className="max-w-2xl mx-auto">
            {mode === 'gif' ? (
              <GifUploader onFileSelect={handleFileSelect} />
            ) : (
              <ImageUploader onFileSelect={handleFileSelect} />
            )}
          </div>
        )}

        {/* Main Content */}
        {selectedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Previews */}
            <div className="space-y-6">
              {/* Original File */}
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  {mode === 'gif' ? '🎬 GIF Original' : '🖼️ Imagem Original'}
                </h2>
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalPreview}
                    alt={mode === 'gif' ? 'Original GIF' : 'Original Image'}
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                  <p className="text-sm text-gray-300 mt-4 font-medium">
                    📁 {selectedFile.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setOriginalPreview('');
                    setAsciiFrames([]);
                    setStaticAscii('');
                  }}
                  className="mt-4 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-lg"
                >
                  ← Escolher outro arquivo
                </button>
              </div>

              {/* ASCII Preview */}
              {mode === 'gif' && asciiFrames.length > 0 && currentSettings && (
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    Prévia ASCII
                  </h2>
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <AsciiPreview
                      frames={asciiFrames}
                      fontSize={currentSettings.fontSize}
                      textColor={currentSettings.textColor}
                      backgroundColor={currentSettings.backgroundColor}
                    />
                  </div>
                </div>
              )}

              {mode === 'image' && staticAscii && currentSettings && (
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    Prévia ASCII
                  </h2>
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <StaticAsciiPreview
                      ascii={staticAscii}
                      fontSize={currentSettings.fontSize}
                      textColor={currentSettings.textColor}
                      backgroundColor={currentSettings.backgroundColor}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Controls */}
            <div>
              <ControlPanel
                onConvert={handleConvert}
                onDownload={handleDownload}
                onCopy={handleCopy}
                isConverting={isConverting}
                isDownloading={isDownloading}
                isCopying={isCopying}
                hasPreview={mode === 'gif' ? asciiFrames.length > 0 : staticAscii.length > 0}
                canCopy={mode === 'image' ? staticAscii.length > 0 : asciiFrames.length > 0}
                asciiLength={mode === 'image' ? staticAscii.length : (asciiFrames.length > 0 ? asciiFrames[0].ascii.length : 0)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
