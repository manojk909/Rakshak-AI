'use client';
import { useRef, useState } from 'react';
import { Upload, ScanLine } from 'lucide-react';
import { analyzeNote } from '@/lib/api';
import type { CounterfeitResult } from '@/lib/types';

export default function NoteScanner({
  denomination, onResult,
}: { denomination: number; onResult: (r: CounterfeitResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setError('Only JPG/PNG images are accepted');
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const analyze = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const result = await analyzeNote(file, denomination);
      onResult(result);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Analysis failed — is the backend running?');
    } finally {
      // Clear image from client memory immediately (matches backend no-persistence policy)
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
        className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-900/50"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Note preview" className="max-h-52 mx-auto rounded-lg" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 mt-3">Drag &amp; drop a ₹{denomination} note photo, or tap to upload</p>
            <p className="text-xs text-slate-500 mt-1">JPG/PNG · max 8MB · rear camera opens on mobile</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>

      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

      <button
        onClick={analyze}
        disabled={!file || busy}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold rounded-xl py-3 transition-colors"
      >
        <ScanLine className="w-5 h-5" />
        {busy ? 'Running microprint, serial, and security-thread checks…' : 'Analyze Note'}
      </button>
    </div>
  );
}
