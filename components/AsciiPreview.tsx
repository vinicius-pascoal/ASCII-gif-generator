'use client';

import { useEffect, useRef, useState } from 'react';
import type { AsciiFrame } from '@/lib/ascii-converter';

interface AsciiPreviewProps {
  frames: AsciiFrame[];
  isPlaying?: boolean;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
}

export default function AsciiPreview({
  frames,
  isPlaying = true,
  fontSize = 6,
  textColor = '#00ff00',
  backgroundColor = '#000000'
}: AsciiPreviewProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const currentFrame = frames[currentFrameIndex];
    // Usa o delay exato do frame original
    const timeoutId = setTimeout(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, currentFrame.delay);

    return () => clearTimeout(timeoutId);
  }, [currentFrameIndex, frames, isPlaying]);

  if (frames.length === 0) {
    return null;
  }

  const currentFrame = frames[currentFrameIndex];

  return (
    <div className="w-full">
      <div
        className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"
        style={{ backgroundColor }}
      >
        <pre
          ref={preRef}
          className="m-0 p-4 overflow-auto whitespace-pre"
          style={{
            fontFamily: 'monospace',
            fontSize: `${fontSize}px`,
            lineHeight: '1',
            color: textColor,
            backgroundColor,
          }}
        >
          {currentFrame.ascii}
        </pre>
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
        Frame {currentFrameIndex + 1} de {frames.length}
      </div>
    </div>
  );
}
