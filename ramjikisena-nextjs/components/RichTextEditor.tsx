'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link as LinkIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Code, RemoveFormatting
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState<{ [key: string]: boolean }>({});
  const isInternalUpdate = useRef(false);

  // Sync value from props only if changed externally (e.g., initial load from DB)
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const updateState = useCallback(() => {
    if (typeof document === 'undefined') return;
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html === '<p><br></p>' || html === '<br>' ? '' : html);
      updateState();
    }
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    editorRef.current?.focus();
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, val);
      handleInput();
    }
  };

  const setHeading = (level: 1 | 2 | 3) => {
    exec('formatBlock', `<h${level}>`);
  };

  const setParagraph = () => {
    exec('formatBlock', '<p>');
  };

  const setBlockquote = () => {
    exec('formatBlock', '<blockquote>');
  };

  const setLink = () => {
    const url = window.prompt('Enter link URL (e.g. https://...):', 'https://');
    if (url) {
      exec('createLink', url);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      exec('insertImage', url);
    }
  };

  // Word and character counts
  const rawText = (value || '').replace(/<[^>]+>/g, ' ').trim();
  const words = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;
  const chars = rawText.replace(/\s+/g, '').length;

  return (
    <div className="border border-orange-200/80 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 border-b border-orange-100 bg-[#FFFDF9]">
        {/* History */}
        <button
          type="button"
          onClick={() => exec('undo')}
          title="Undo"
          className="p-1.5 rounded-lg text-slate-600 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('redo')}
          title="Redo"
          className="p-1.5 rounded-lg text-slate-600 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-orange-200/60 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => setHeading(1)}
          title="Heading 1"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 font-bold text-xs transition-colors flex items-center"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setHeading(2)}
          title="Heading 2"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 font-bold text-xs transition-colors flex items-center"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setHeading(3)}
          title="Heading 3"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 font-bold text-xs transition-colors flex items-center"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={setParagraph}
          title="Regular Paragraph"
          className="px-2 py-1 rounded-lg text-slate-600 hover:bg-orange-100 hover:text-orange-800 font-bold text-xs transition-colors"
        >
          P
        </button>

        <div className="w-px h-5 bg-orange-200/60 mx-1" />

        {/* Formatting */}
        <button
          type="button"
          onClick={() => exec('bold')}
          title="Bold"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.bold ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          title="Italic"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.italic ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          title="Underline"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.underline ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          title="Strikethrough"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.strikeThrough ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<pre>')}
          title="Code Block"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-orange-200/60 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          title="Bullet List"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.insertUnorderedList ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          title="Numbered List"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.insertOrderedList ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100 hover:text-orange-800'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={setBlockquote}
          title="Blockquote"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertHorizontalRule')}
          title="Horizontal Rule"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-orange-200/60 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          title="Align Left"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.justifyLeft ? 'bg-orange-500 text-white' : 'text-slate-700 hover:bg-orange-100'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          title="Align Center"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.justifyCenter ? 'bg-orange-500 text-white' : 'text-slate-700 hover:bg-orange-100'
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          title="Align Right"
          className={`p-1.5 rounded-lg transition-colors ${
            activeStyles.justifyRight ? 'bg-orange-500 text-white' : 'text-slate-700 hover:bg-orange-100'
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-orange-200/60 mx-1" />

        {/* Media & Links */}
        <button
          type="button"
          onClick={setLink}
          title="Insert Link"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          title="Insert Image by URL"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          title="Clear Formatting"
          className="p-1.5 rounded-lg text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        {/* Stats counter */}
        <div className="ml-auto text-xs text-slate-400 font-medium pl-2 select-none">
          <span className="text-orange-600 font-bold">{words}</span> words · <span className="text-slate-600 font-bold">{chars}</span> chars
        </div>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={updateState}
        onMouseUp={updateState}
        className="blog-content min-h-[380px] p-6 outline-none focus:outline-none bg-white text-slate-800"
        style={{ minHeight: '380px' }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
