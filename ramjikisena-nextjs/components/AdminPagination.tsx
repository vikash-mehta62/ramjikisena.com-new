'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  itemName?: string;
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50, 100],
  itemName = 'रिकॉर्ड्स'
}: AdminPaginationProps) {
  const [jumpInput, setJumpInput] = useState('');

  if (total <= 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);
  const actualTotalPages = Math.max(1, totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > actualTotalPages || newPage === page) return;
    onPageChange(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= actualTotalPages) {
      handlePageChange(target);
      setJumpInput('');
    }
  };

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (actualTotalPages <= maxVisible + 2) {
      for (let i = 1; i <= actualTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(actualTotalPages - 1, page + 1);

      if (page <= 3) {
        end = 4;
      } else if (page >= actualTotalPages - 2) {
        start = actualTotalPages - 3;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < actualTotalPages - 1) pages.push('...');

      pages.push(actualTotalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col lg:flex-row items-center justify-between gap-4 mt-6">
      {/* Information & Per Page Selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span>दिखाया जा रहा है:</span>
          <strong className="text-slate-900 font-black">{startRecord}</strong>
          <span>-</span>
          <strong className="text-slate-900 font-black">{endRecord}</strong>
          <span>(कुल <strong className="text-slate-900 font-black">{total}</strong> {itemName})</span>
        </div>

        <div className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 font-bold text-[11px]">
          पेज <strong className="text-orange-600 font-black">{page}</strong> / <strong className="text-slate-900 font-black">{actualTotalPages}</strong>
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold">प्रति पेज:</span>
            <select
              value={limit}
              onChange={(e) => {
                onLimitChange(Number(e.target.value));
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Records per page"
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={page <= 1}
          title="पहला पेज (First Page)"
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page Button with Label */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          title="पिछला पेज (Previous Page)"
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
            page > 1
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm active:scale-95'
              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>पिछला (Prev)</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-xs font-bold select-none">
                  ...
                </span>
              );
            }
            const pageNum = Number(p);
            const isCurrent = pageNum === page;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[34px] h-8 px-2 text-xs font-black rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button with High-Visibility Orange Accent */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= actualTotalPages}
          title={page >= actualTotalPages ? 'आप अंतिम पेज पर हैं' : 'अगले पेज पर जाएं (Next Page)'}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
            page < actualTotalPages
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <span>अगला (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(actualTotalPages)}
          disabled={page >= actualTotalPages}
          title="अंतिम पेज (Last Page)"
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        {/* Jump to Page Input when multiple pages exist */}
        {actualTotalPages > 2 && (
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold">पेज:</span>
            <input
              type="number"
              min={1}
              max={actualTotalPages}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={String(page)}
              className="w-12 px-1.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-black text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
