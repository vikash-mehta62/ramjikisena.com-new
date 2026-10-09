'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  TrendingUp, Users, Eye, Clock, Globe, MapPin, Smartphone,
  Monitor, Activity, RefreshCw, Filter, ShieldAlert,
  ArrowUpRight, ChevronRight, Compass, Target, Layers, Radio,
  Laptop, Tablet, ShieldCheck
} from 'lucide-react';

const fmtNumber = (n: number) => (n || 0).toLocaleString('en-IN');
const fmtDuration = (sec: number) => {
  if (!sec || sec <= 0) return '0s';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'amber'
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: any;
  color?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'orange';
}) {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };
  const cls = colorMap[color] || colorMap.amber;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex justify-between items-start">
      <div className="space-y-1.5 flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight truncate">{value}</p>
        {sub && <p className="text-xs font-semibold text-slate-500">{sub}</p>}
      </div>
      {Icon && (
        <div className={`p-2.5 rounded-xl border ${cls} ml-3 flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Filters State
  const [range, setRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [includeBot, setIncludeBot] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'pages' | 'logs'>('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [range, startDate, endDate, stateFilter, cityFilter, pathFilter, includeBot]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('range', range);
      if (range === 'custom' && startDate && endDate) {
        query.set('startDate', new Date(startDate).toISOString());
        query.set('endDate', new Date(endDate).toISOString());
      }
      if (stateFilter) query.set('state', stateFilter);
      if (cityFilter) query.set('city', cityFilter);
      if (pathFilter) query.set('path', pathFilter);
      query.set('isBot', includeBot ? 'true' : 'false');

      const res = await api.get(`/api/analytics/admin/stats?${query.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {};
  const locations = data?.locations || {};
  const pages = data?.pages || [];
  const tech = data?.tech || {};
  const recentLogs = data?.recentLogs || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">विज़िटर ट्रैफ़िक एवं एनालिटिक्स (Visits & Analytics)</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              रियल-टाइम विज़िटर्स, राज्य/शहर रिपोर्ट, पृष्ठ समय एवं ट्रैफ़िक स्रोत
            </p>
          </div>
        </div>

        <button
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all shadow-sm self-end sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश (Refresh)</span>
        </button>
      </div>

      {/* Date Range & Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            {[
              { label: 'आज (Today)', val: 'today' },
              { label: 'कल (Yesterday)', val: 'yesterday' },
              { label: '7 दिन (1 Week)', val: '1week' },
              { label: '30 दिन (1 Month)', val: '30days' },
              { label: 'कुल समय (All Time)', val: 'alltime' },
              { label: 'कस्टम तारीख', val: 'custom' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setRange(item.val)}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${
                  range === item.val
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Bot traffic toggle */}
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <input
                type="checkbox"
                checked={includeBot}
                onChange={(e) => setIncludeBot(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>बॉट ट्रैफ़िक शामिल करें (Include Bots)</span>
            </label>
          </div>
        </div>

        {/* Custom Date Pickers */}
        {range === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">आरंभ:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">समाप्ति:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* Sub-Filters (State, City, Path) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="राज्य से फ़िल्टर करें (उदा. Uttar Pradesh, Maharashtra)..."
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-slate-50"
          />
          <input
            type="text"
            placeholder="शहर से फ़िल्टर करें (उदा. Ayodhya, Delhi, Mumbai)..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-slate-50"
          />
          <input
            type="text"
            placeholder="पेज पाथ से फ़िल्टर करें (उदा. /, /mandirs, /pandits)..."
            value={pathFilter}
            onChange={(e) => setPathFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-slate-50"
          />
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="कुल विज़िट्स (Pageviews)"
          value={fmtNumber(summary.totalPageviews)}
          sub="कुल पेज देखे गए"
          icon={Eye}
          color="amber"
        />
        <StatCard
          label="यूनिक विज़िटर्स (Unique)"
          value={fmtNumber(summary.uniqueVisitors)}
          sub="विशिष्ट व्यक्ति / डिवाइस"
          icon={Users}
          color="blue"
        />
        <StatCard
          label="सत्र संख्या (Sessions)"
          value={fmtNumber(summary.totalSessions)}
          sub="सक्रिय विज़िट सेशन्स"
          icon={Layers}
          color="purple"
        />
        <StatCard
          label="औसत समय (Avg. Dwell)"
          value={fmtDuration(summary.avgDurationSeconds)}
          sub="प्रति पेज रुकने का समय"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          label="लाइव विज़िटर्स (Live Now)"
          value={fmtNumber(summary.liveVisitors)}
          sub="पिछले 5 मिनट में सक्रिय"
          icon={Activity}
          color="orange"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>अवलोकन (Overview)</span>
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'locations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>राज्य व शहर (Locations)</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'pages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>लोकप्रिय पेज (Top Pages)</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'logs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>लाइव विज़िट लॉग्स (Real-time Logs)</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-sm font-bold text-slate-500">ट्रैफ़िक एनालिटिक्स लोड हो रहा है...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Devices Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>डिवाइस विभाजन (Device Types)</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {(tech?.devices || []).map((dev: any) => {
                    const totalDev = tech?.devices.reduce((acc: number, d: any) => acc + d.count, 0) || 1;
                    const pct = Math.round((dev.count / totalDev) * 100);
                    return (
                      <div key={dev._id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="capitalize flex items-center gap-1.5">
                            {dev._id === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : dev._id === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                            {dev._id || 'Desktop'}
                          </span>
                          <span>{fmtNumber(dev.count)} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Browsers Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>ब्राउज़र विवरण (Browsers)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {(tech?.browsers || []).slice(0, 5).map((b: any) => (
                    <div key={b._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-bold">
                      <span className="text-slate-800">{b._id || 'Other'}</span>
                      <span className="text-blue-600 font-black">{fmtNumber(b.count)} विज़िट्स</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating System Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-purple-600" />
                    <span>ऑपरेटिंग सिस्टम (Operating Systems)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {(tech?.os || []).slice(0, 5).map((o: any) => (
                    <div key={o._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-bold">
                      <span className="text-slate-800">{o._id || 'Other'}</span>
                      <span className="text-purple-600 font-black">{fmtNumber(o.count)} विज़िट्स</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* States Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>शीर्ष राज्य (Top States in India)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="pb-3">राज्य (State)</th>
                        <th className="pb-3 text-right">विज़िट्स (Views)</th>
                        <th className="pb-3 text-right">यूनिक विज़िटर्स</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {(locations?.byState || []).map((s: any) => (
                        <tr key={s.state} className="hover:bg-slate-50/80">
                          <td className="py-3 text-slate-900 font-black flex items-center gap-2">
                            <span>🇮🇳</span> {s.state}
                          </td>
                          <td className="py-3 text-right text-orange-600 font-black">{fmtNumber(s.count)}</td>
                          <td className="py-3 text-right text-slate-600">{fmtNumber(s.uniqueVisitors)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cities Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>शीर्ष नगर व शहर (Top Cities)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="pb-3">शहर (City)</th>
                        <th className="pb-3">राज्य (State)</th>
                        <th className="pb-3 text-right">विज़िट्स</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {(locations?.byCity || []).map((c: any) => (
                        <tr key={c.city} className="hover:bg-slate-50/80">
                          <td className="py-3 text-slate-900 font-black">{c.city}</td>
                          <td className="py-3 text-slate-500">{c.state}</td>
                          <td className="py-3 text-right text-emerald-600 font-black">{fmtNumber(c.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAGES */}
          {activeTab === 'pages' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                <span>सर्वाधिक देखे गए पेज (Top Visited Pages)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                      <th className="pb-3">पेज पाथ (Page URL)</th>
                      <th className="pb-3 text-right">पेजव्यूज (Views)</th>
                      <th className="pb-3 text-right">यूनिक विज़िटर्स</th>
                      <th className="pb-3 text-right">औसत समय (Avg. Dwell)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {(pages || []).map((p: any) => (
                      <tr key={p.path} className="hover:bg-slate-50/80">
                        <td className="py-3.5 text-slate-900 font-black">
                          <code className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-800">
                            {p.path}
                          </code>
                        </td>
                        <td className="py-3.5 text-right text-orange-600 font-black">{fmtNumber(p.views)}</td>
                        <td className="py-3.5 text-right text-slate-600">{fmtNumber(p.uniqueVisitors)}</td>
                        <td className="py-3.5 text-right text-emerald-600 font-black">{fmtDuration(p.avgDuration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REAL-TIME LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>लाइव विज़िटर्स टेलीमेट्री (Real-time Live Feed)</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">नवीनतम 40 विज़िट्स</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                      <th className="pb-3">समय (Time)</th>
                      <th className="pb-3">IP (Masked)</th>
                      <th className="pb-3">स्थान (City, State)</th>
                      <th className="pb-3">उपयोगकर्ता</th>
                      <th className="pb-3">देखा गया पेज (Path)</th>
                      <th className="pb-3">डिवाइस / ब्राउज़र</th>
                      <th className="pb-3 text-right">सक्रिय समय</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {recentLogs.map((log: any) => (
                      <tr key={log.visitId} className="hover:bg-slate-50/80">
                        <td className="py-3 text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                          {log.ip}
                        </td>
                        <td className="py-3 text-slate-800 whitespace-nowrap">
                          📍 {log.city}, {log.state}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            log.userRole === 'admin' ? 'bg-orange-100 text-orange-800' :
                            log.userRole === 'staff' ? 'bg-indigo-100 text-indigo-800' :
                            log.userRole === 'pandit' ? 'bg-red-100 text-red-800' :
                            log.userRole === 'user' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {log.userName || log.userRole}
                          </span>
                        </td>
                        <td className="py-3 text-slate-900 font-black">
                          <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-orange-800">
                            {log.path}
                          </code>
                        </td>
                        <td className="py-3 text-slate-600 whitespace-nowrap">
                          {log.deviceType} • {log.browser}
                        </td>
                        <td className="py-3 text-right text-emerald-600 font-black whitespace-nowrap">
                          {fmtDuration(log.durationSeconds)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
