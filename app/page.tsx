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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            ASCII Art Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transforme GIFs e imagens em arte ASCII
          </p>
        </header>

        {/* Mode Selector */}
        {!selectedFile && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1 bg-white dark:bg-gray-800">
              <button
                onClick={() => handleModeChange('gif')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'gif'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                🎬 GIF
              </button>
              <button
                onClick={() => handleModeChange('image')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'image'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {mode === 'gif' ? 'GIF Original' : 'Imagem Original'}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalPreview}
                    alt={mode === 'gif' ? 'Original GIF' : 'Original Image'}
                    className="w-full h-auto rounded"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {selectedFile.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setOriginalPreview('');
                    setAsciiFrames([]);
                    setStaticAscii('');
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Escolher outro arquivo
                </button>
              </div>

              {/* ASCII Preview */}
              {mode === 'gif' && asciiFrames.length > 0 && currentSettings && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Prévia ASCII
                  </h2>
                  <AsciiPreview
                    frames={asciiFrames}
                    fontSize={currentSettings.fontSize}
                    textColor={currentSettings.textColor}
                    backgroundColor={currentSettings.backgroundColor}
                  />
                </div>
              )}

              {mode === 'image' && staticAscii && currentSettings && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Prévia ASCII
                  </h2>
                  <StaticAsciiPreview
                    ascii={staticAscii}
                    fontSize={currentSettings.fontSize}
                    textColor={currentSettings.textColor}
                    backgroundColor={currentSettings.backgroundColor}
                  />
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
