'use client';

import { useState } from 'react';
import GifUploader from '@/components/GifUploader';
import AsciiPreview from '@/components/AsciiPreview';
import ControlPanel, { type ConversionSettings } from '@/components/ControlPanel';
import { parseGifFile, convertFramesToAscii, createAsciiGif } from '@/lib/gif-processor';
import type { AsciiFrame } from '@/lib/ascii-converter';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [asciiFrames, setAsciiFrames] = useState<AsciiFrame[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<ConversionSettings | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setAsciiFrames([]);
  };

  const handleConvert = async (settings: ConversionSettings) => {
    if (!selectedFile) return;

    setIsConverting(true);
    setCurrentSettings(settings);

    try {
      // Parse o GIF
      const frames = await parseGifFile(selectedFile);

      // Converte para ASCII
      const ascii = convertFramesToAscii(frames, settings.width, settings.invert);

      setAsciiFrames(ascii);
    } catch (error) {
      console.error('Erro ao converter GIF:', error);
      alert('Erro ao converter o GIF. Tente outro arquivo.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (asciiFrames.length === 0 || !currentSettings) return;

    setIsDownloading(true);
    try {
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
    } catch (error) {
      console.error('Erro ao criar GIF:', error);
      alert('Erro ao criar o GIF ASCII. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            GIF to ASCII Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transforme seus GIFs em arte ASCII animada
          </p>
        </header>

        {/* Upload Area */}
        {!selectedFile && (
          <div className="max-w-2xl mx-auto">
            <GifUploader onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Main Content */}
        {selectedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Previews */}
            <div className="space-y-6">
              {/* Original GIF */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  GIF Original
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalPreview}
                    alt="Original GIF"
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
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Escolher outro arquivo
                </button>
              </div>

              {/* ASCII Preview */}
              {asciiFrames.length > 0 && currentSettings && (
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
            </div>

            {/* Right Column - Controls */}
            <div>
              <ControlPanel
                onConvert={handleConvert}
                onDownload={handleDownload}
                isConverting={isConverting}
                isDownloading={isDownloading}
                hasPreview={asciiFrames.length > 0}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Feito com Next.js e TypeScript</p>
        </footer>
      </div>
    </div>
  );
}
