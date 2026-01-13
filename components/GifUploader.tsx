'use client';

import { useRef, useState } from 'react';

interface GifUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function GifUploader({ onFileSelect, disabled }: GifUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'image/gif') {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'image/gif') {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/gif"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 transform
          ${dragActive
            ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-green-500/20 scale-105 shadow-[0_0_40px_rgba(34,211,238,0.6)] animate-pulse-glow'
            : 'border-cyan-500/40 bg-gray-800/70 hover:border-cyan-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] backdrop-blur-sm'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleClick}
      >
        <div className="space-y-6">
          <div className="text-8xl animate-float">🎬</div>
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Arraste um GIF aqui
            </p>
            <p className="text-base text-gray-300 mt-3 font-medium">
              ou clique para selecionar um arquivo
            </p>
          </div>
          <p className="text-sm text-gray-400 bg-gray-700/80 rounded-lg px-4 py-2 inline-block border border-cyan-500/20">
            📎 Apenas arquivos .gif são aceitos
          </p>
        </div>
      </div>
    </div>
  );
}
