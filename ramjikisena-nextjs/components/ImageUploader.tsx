'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  /** Current image URL(s) */
  value: string | string[];
  /** Called with new URL(s) after upload */
  onChange: (value: string | string[]) => void;
  /** Allow multiple images */
  multiple?: boolean;
  /** Cloudinary folder name */
  folder?: string;
  /** Label shown above uploader */
  label?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = 'samagri',
  label = 'Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls: string[] = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (typeof value === 'string' && value ? [value] : []);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArr.length === 0) return;

    // 5 MB limit per file
    for (const f of fileArr) {
      if (f.size > 5 * 1024 * 1024) {
        alert(`${f.name} is too large (max 5 MB)`);
        return;
      }
    }

    setUploading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      if (!multiple || fileArr.length === 1) {
        // Single upload
        const form = new FormData();
        form.append('image', fileArr[0]);
        const res = await fetch(`${API_URL}/api/upload/image?folder=${folder}`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: form,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Upload failed');
        onChange(multiple ? [...urls, data.url] : data.url);
      } else {
        // Multiple upload
        const form = new FormData();
        fileArr.forEach(f => form.append('images', f));
        const res = await fetch(`${API_URL}/api/upload/images?folder=${folder}`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: form,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Upload failed');
        onChange([...urls, ...data.urls]);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    if (multiple) {
      const next = urls.filter((_, i) => i !== idx);
      onChange(next);
    } else {
      onChange('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-semibold text-gray-700 block">{label}</label>}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
          ${dragOver ? 'border-orange-500 bg-orange-50' : 'border-orange-300 bg-orange-50/50 hover:border-orange-500 hover:bg-orange-50'}
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-sm text-orange-600 font-medium">Uploading to Cloudinary...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {multiple ? 'Click or drag images here' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 5 MB each</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
          {urls.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-orange-200 aspect-square">
              <img src={url} alt={`upload-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {/* Add more button when multiple */}
          {multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-orange-300 rounded-xl flex items-center justify-center text-orange-400 hover:border-orange-500 hover:text-orange-600 transition-all disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
