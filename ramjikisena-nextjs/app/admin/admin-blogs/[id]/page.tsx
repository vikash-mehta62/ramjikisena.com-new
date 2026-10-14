'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Save, Eye, ArrowLeft, Plus, Trash2,
  AlertCircle, CheckCircle, RefreshCw, Globe,
  Image as ImageIcon, Sparkles, CheckCircle2
} from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

const CATEGORIES = [
  'Spiritual Knowledge',
  'Mandir Stories',
  'Pooja Guides',
  'Katha & Satsang',
  'Festivals & Vrat',
  'Ram Katha',
  'Sanatan Dharma',
  'Devotee Experiences',
  'Vedic Astrology',
  'Other',
];

interface BlogState {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage: string;
  featuredImageAlt: string;
  seo: {
    focusKeyword: string;
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    noIndex: boolean;
  };
  schemaMarkup: {
    article: boolean;
    faqPage: boolean;
    breadcrumb: boolean;
  };
  faqs: Array<{ question: string; answer: string }>;
}

const EMPTY_BLOG: BlogState = {
  title: '',
  slug: '',
  category: 'Spiritual Knowledge',
  tags: [],
  shortDescription: '',
  content: '',
  author: 'श्री राम जी की सेना',
  status: 'draft',
  featuredImage: '',
  featuredImageAlt: '',
  seo: {
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    noIndex: false,
  },
  schemaMarkup: {
    article: true,
    faqPage: false,
    breadcrumb: true,
  },
  faqs: [],
};

function slugify(text: string) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calcReadTime(html: string) {
  const words = (html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function calcSeo(blog: BlogState) {
  const kw = (blog.seo.focusKeyword || '').toLowerCase().trim();
  if (!kw) {
    return {
      score: 0,
      checks: [{ label: 'Set a focus keyword', pass: false }],
    };
  }

  const title = (blog.title || '').toLowerCase();
  const desc = (blog.seo.metaDescription || blog.shortDescription || '').toLowerCase();
  const text = (blog.content || '').replace(/<[^>]+>/g, ' ').toLowerCase();
  const h2s = (blog.content || '').match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];

  const checks = [
    { label: 'Keyword in article title', pass: title.includes(kw) },
    { label: 'Keyword in meta description', pass: desc.includes(kw) },
    { label: 'Keyword in first 300 characters', pass: text.substring(0, 300).includes(kw) },
    { label: 'Keyword in H2 heading', pass: h2s.some((h) => h.toLowerCase().includes(kw)) },
    { label: 'Meta description length (120–160 chars)', pass: desc.length >= 120 && desc.length <= 160 },
    { label: 'Title length (50–60 chars)', pass: title.length >= 40 && title.length <= 65 },
    { label: 'Content length (>300 words)', pass: text.trim().split(/\s+/).filter(Boolean).length >= 300 },
    { label: 'Featured image set', pass: !!blog.featuredImage },
    { label: 'Featured image alt text set', pass: !!blog.featuredImageAlt },
    { label: 'URL slug set', pass: !!blog.slug },
  ];

  const passedCount = checks.filter((c) => c.pass).length;
  const score = Math.round((passedCount / checks.length) * 100);
  return { score, checks };
}

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [blog, setBlog] = useState<BlogState>(EMPTY_BLOG);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tab, setTab] = useState<'editor' | 'html' | 'preview'>('editor');
  const [tagInput, setTagInput] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [id]);

  // Auto-save every 30 seconds for existing blogs
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (!isNew && blog.title.trim()) {
        handleSave(true);
      }
    }, 30000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [blog, isNew]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && blog.title) {
      setBlog((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [blog.title, slugManual]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/admin/${id}`, {
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const data = await res.json();
      if (data.success && data.blog) {
        setBlog({
          ...EMPTY_BLOG,
          ...data.blog,
          seo: { ...EMPTY_BLOG.seo, ...(data.blog.seo || {}) },
          schemaMarkup: { ...EMPTY_BLOG.schemaMarkup, ...(data.blog.schemaMarkup || {}) },
          faqs: Array.isArray(data.blog.faqs) ? data.blog.faqs : [],
        });
        setSlugManual(true);
      } else {
        alert(data.message || 'Failed to load blog');
      }
    } catch (error) {
      console.error('Fetch blog error:', error);
      alert('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isAuto = false) => {
    if (!blog.title.trim()) {
      if (!isAuto) alert('Please provide a blog title');
      return;
    }
    if (!blog.slug.trim()) {
      if (!isAuto) alert('Please provide a URL slug');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = isNew
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/blogs/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(blog),
      });
      const data = await res.json();

      if (data.success) {
        setLastSaved(new Date());
        if (!isAuto) {
          alert(isNew ? 'Blog post created successfully!' : 'Blog post saved successfully!');
          if (isNew && data.blog?._id) {
            router.replace(`/admin/admin-blogs/${data.blog._id}`);
          }
        }
      } else {
        if (!isAuto) alert(data.message || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Save blog error:', error);
      if (!isAuto) alert('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('image', file); // support both keys

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'}/api/upload/image?folder=blogs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setBlog((p) => ({ ...p, featuredImage: data.url }));
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !blog.tags.includes(t)) {
      setBlog((p) => ({ ...p, tags: [...p.tags, t] }));
    }
    setTagInput('');
  };

  const seo = calcSeo(blog);
  const readTime = calcReadTime(blog.content);
  const descLen = (blog.seo.metaDescription || blog.shortDescription || '').length;

  const inputStyle = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none bg-white transition-all text-slate-800';
  const labelStyle = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-slate-600">Loading Blog Editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-4 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/admin-blogs"
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog List
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          {lastSaved && (
            <span className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Saved {lastSaved.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Status selector */}
          <select
            value={blog.status}
            onChange={(e) => setBlog((p) => ({ ...p, status: e.target.value as any }))}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-orange-400 outline-none cursor-pointer"
          >
            <option value="draft">🟡 Draft</option>
            <option value="published">🟢 Published</option>
            <option value="archived">⚪ Archived</option>
          </select>

          {/* Preview Public link */}
          {blog.status === 'published' && !isNew && (
            <Link
              href={`/blogs/${blog.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-blue-500" /> Preview
            </Link>
          )}

          {/* Save Button */}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-sm font-black shadow-lg shadow-orange-500/20 disabled:opacity-60 transition-all hover:scale-105"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug Box */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6">
            <input
              type="text"
              placeholder="Enter divine blog title..."
              value={blog.title}
              onChange={(e) => setBlog((p) => ({ ...p, title: e.target.value }))}
              className="w-full text-2xl md:text-3xl font-black border-0 outline-none placeholder-slate-300 text-slate-900 mb-3 bg-transparent"
            />
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Slug:</span>
              <span className="text-slate-400 font-mono">/blogs/</span>
              <input
                type="text"
                value={blog.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setBlog((p) => ({ ...p, slug: slugify(e.target.value) }));
                }}
                className="flex-1 font-mono text-orange-600 font-bold outline-none bg-orange-50/50 px-2 py-1 rounded-lg border border-orange-200/50 min-w-[140px]"
                placeholder="auto-generated-slug"
              />
              <span className="text-slate-400 font-medium ml-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                ⏳ {readTime} min read
              </span>
            </div>
          </div>

          {/* Editor Area with Tabs */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-orange-100 bg-orange-50/30 px-4">
              {[
                { id: 'editor', label: 'Visual Editor' },
                { id: 'html', label: 'HTML Code' },
                { id: 'preview', label: 'Live Preview' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                    tab === t.id
                      ? 'border-orange-500 text-orange-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Visual Editor */}
            {tab === 'editor' && (
              <div className="p-4">
                <RichTextEditor
                  value={blog.content}
                  onChange={(val) => setBlog((p) => ({ ...p, content: val }))}
                  placeholder="Write the article content, spiritual insights, and stories here..."
                />
              </div>
            )}

            {/* Tab 2: Raw HTML */}
            {tab === 'html' && (
              <div className="p-5">
                <textarea
                  value={blog.content}
                  onChange={(e) => setBlog((p) => ({ ...p, content: e.target.value }))}
                  rows={20}
                  className="w-full border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 leading-relaxed"
                />
              </div>
            )}

            {/* Tab 3: Rendered Preview */}
            {tab === 'preview' && (
              <div className="p-8 min-h-[400px]">
                {blog.content ? (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <p className="text-slate-400 italic text-center py-16">
                    No content written yet. Switch back to Visual Editor to compose!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6">
            <label className={labelStyle}>
              Short Description <span className="text-slate-400 font-normal lowercase">(summary shown on cards & search)</span>
            </label>
            <textarea
              rows={3}
              value={blog.shortDescription}
              onChange={(e) => setBlog((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="Brief overview of the article..."
              className={inputStyle}
            />
          </div>

          {/* FAQ Builder */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">Frequently Asked Questions (FAQ)</h3>
                <p className="text-xs text-slate-400">Adds rich Google FAQ schema and answers for readers</p>
              </div>
              <button
                type="button"
                onClick={() => setBlog((p) => ({ ...p, faqs: [...p.faqs, { question: '', answer: '' }] }))}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold transition-colors border border-orange-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {blog.faqs.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                No FAQs added yet. Click &quot;Add Question&quot; to boost SEO rankings with FAQ schema.
              </div>
            ) : (
              <div className="space-y-3.5">
                {blog.faqs.map((faq, i) => (
                  <div key={i} className="border border-orange-100 rounded-2xl p-4 bg-orange-50/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-orange-600">Question {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => setBlog((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. राम नाम जप करने के क्या लाभ हैं?"
                      value={faq.question}
                      onChange={(e) =>
                        setBlog((p) => {
                          const f = [...p.faqs];
                          f[i] = { ...f[i], question: e.target.value };
                          return { ...p, faqs: f };
                        })
                      }
                      className={inputStyle}
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer..."
                      value={faq.answer}
                      onChange={(e) =>
                        setBlog((p) => {
                          const f = [...p.faqs];
                          f[i] = { ...f[i], answer: e.target.value };
                          return { ...p, faqs: f };
                        })
                      }
                      className={inputStyle}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (1 Col Sidebar) */}
        <div className="space-y-6">
          {/* Live SEO Score Gauge */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" /> Live SEO Score
              </h3>
              <span
                className={`text-2xl font-black ${
                  seo.score >= 80 ? 'text-emerald-600' : seo.score >= 50 ? 'text-amber-600' : 'text-red-500'
                }`}
              >
                {seo.score}/100
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  seo.score >= 80 ? 'bg-emerald-500' : seo.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${seo.score}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {seo.checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {c.pass ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <span className={c.pass ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Post Settings */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Post Settings</h3>

            <div>
              <label className={labelStyle}>Category</label>
              <select
                value={blog.category}
                onChange={(e) => setBlog((p) => ({ ...p, category: e.target.value }))}
                className={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Author Name</label>
              <input
                type="text"
                value={blog.author}
                onChange={(e) => setBlog((p) => ({ ...p, author: e.target.value }))}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {blog.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-800 rounded-full text-xs font-bold border border-orange-200"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => setBlog((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }))}
                      className="text-orange-400 hover:text-orange-800 text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className={`flex-1 ${inputStyle}`}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6 space-y-3.5">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Featured Image</h3>

            {blog.featuredImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                <img
                  src={blog.featuredImage}
                  alt={blog.featuredImageAlt || blog.title}
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setBlog((p) => ({ ...p, featuredImage: '' }))}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm hover:bg-red-700 shadow-lg"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-orange-200 rounded-2xl cursor-pointer hover:border-orange-400 bg-orange-50/20 transition-all">
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-slate-500">Uploading image...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-orange-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Click to upload image</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            )}

            <div>
              <label className={labelStyle}>Image Alt Text</label>
              <input
                type="text"
                placeholder="Descriptive text for accessibility & SEO..."
                value={blog.featuredImageAlt}
                onChange={(e) => setBlog((p) => ({ ...p, featuredImageAlt: e.target.value }))}
                className={inputStyle}
              />
            </div>
          </div>

          {/* SEO Suite */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" /> SEO & Meta Tags
            </h3>

            <div>
              <label className={labelStyle}>Focus Keyword</label>
              <input
                type="text"
                placeholder="e.g. ram naam jaap labh"
                value={blog.seo.focusKeyword}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, focusKeyword: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Meta Title{' '}
                <span className={`font-normal lowercase ${(blog.seo.metaTitle || blog.title).length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                  ({(blog.seo.metaTitle || blog.title).length}/60)
                </span>
              </label>
              <input
                type="text"
                placeholder={blog.title || 'Page title in Google'}
                value={blog.seo.metaTitle}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Meta Description{' '}
                <span
                  className={`font-normal lowercase ${
                    descLen > 160 ? 'text-red-500' : descLen >= 120 ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  ({descLen}/160)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder={blog.shortDescription || 'Search snippet summary...'}
                value={blog.seo.metaDescription}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            {/* Google SERP Preview Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Google Search Preview</p>
              <p className="text-blue-700 text-sm font-semibold line-clamp-1 hover:underline cursor-pointer">
                {blog.seo.metaTitle || blog.title || 'Blog Post Title | Ram Ji Ki Sena'}
              </p>
              <p className="text-emerald-700 text-xs font-mono mt-0.5">
                ramjikisena.com/blogs/{blog.slug || 'article-slug'}
              </p>
              <p className="text-slate-600 text-xs line-clamp-2 mt-1">
                {blog.seo.metaDescription || blog.shortDescription || 'Spiritual blog post description will appear here...'}
              </p>
            </div>

            <div>
              <label className={labelStyle}>Canonical URL</label>
              <input
                type="text"
                placeholder="https://ramjikisena.com/blogs/..."
                value={blog.seo.canonicalUrl}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>OG Title</label>
              <input
                type="text"
                placeholder={blog.seo.metaTitle || blog.title}
                value={blog.seo.ogTitle}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, ogTitle: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>OG Description</label>
              <textarea
                rows={2}
                value={blog.seo.ogDescription}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, ogDescription: e.target.value } }))}
                className={inputStyle}
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={blog.seo.noIndex}
                onChange={(e) => setBlog((p) => ({ ...p, seo: { ...p.seo, noIndex: e.target.checked } }))}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700">NoIndex (Hide from search engines)</span>
            </label>
          </div>

          {/* Schema Toggles */}
          <div className="bg-white rounded-3xl border border-orange-100/80 shadow-sm p-6 space-y-3.5">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Schema Markup</h3>
            {[
              { key: 'article', label: 'Article Schema' },
              { key: 'faqPage', label: 'FAQ Page Schema' },
              { key: 'breadcrumb', label: 'Breadcrumb Schema' },
            ].map((s) => {
              const active = blog.schemaMarkup[s.key as keyof typeof blog.schemaMarkup];
              return (
                <label key={s.key} className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-bold text-slate-700">{s.label}</span>
                  <div
                    onClick={() =>
                      setBlog((p) => ({
                        ...p,
                        schemaMarkup: { ...p.schemaMarkup, [s.key]: !active },
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      active ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        active ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
