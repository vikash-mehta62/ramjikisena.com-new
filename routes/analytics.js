const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const VisitLog = require('../models/VisitLog');
const userModel = require('./users');
const adminAuth = require('./middleware/adminAuth');

// 28 Indian States & 8 Union Territories mapping
const STATE_NAMES = {
  'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar',
  'CT': 'Chhattisgarh', 'CG': 'Chhattisgarh', 'GA': 'Goa', 'GJ': 'Gujarat',
  'HR': 'Haryana', 'HP': 'Himachal Pradesh', 'JH': 'Jharkhand', 'KA': 'Karnataka',
  'KL': 'Kerala', 'MP': 'Madhya Pradesh', 'MH': 'Maharashtra', 'MN': 'Manipur',
  'ML': 'Meghalaya', 'MZ': 'Mizoram', 'NL': 'Nagaland', 'OD': 'Odisha',
  'OR': 'Odisha', 'PB': 'Punjab', 'RJ': 'Rajasthan', 'SK': 'Sikkim',
  'TN': 'Tamil Nadu', 'TG': 'Telangana', 'TS': 'Telangana', 'TR': 'Tripura',
  'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'UK': 'Uttarakhand', 'WB': 'West Bengal',
  'AN': 'Andaman and Nicobar', 'CH': 'Chandigarh', 'DH': 'Dadra and Nagar Haveli',
  'DD': 'Daman and Diu', 'DL': 'Delhi', 'JK': 'Jammu and Kashmir',
  'LA': 'Ladakh', 'LD': 'Lakshadweep', 'PY': 'Puducherry'
};

// In-Memory IP Geolocation Cache
const geoCache = new Map();
let cachedDevPublicIp = null;
let lastDevIpFetchTime = 0;

function isPrivateIp(ip) {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, '').trim();
  if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost') return true;
  if (/^10\./.test(clean) || /^192\.168\./.test(clean) || /^127\./.test(clean)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  return false;
}

async function getDevPublicIp() {
  const now = Date.now();
  if (cachedDevPublicIp && (now - lastDevIpFetchTime < 3600000)) {
    return cachedDevPublicIp;
  }
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2500) });
    const data = await res.json();
    if (data && data.ip) {
      cachedDevPublicIp = data.ip;
      lastDevIpFetchTime = now;
      return cachedDevPublicIp;
    }
  } catch (e) {}
  return cachedDevPublicIp || null;
}

function getClientIp(req) {
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp && typeof cfIp === 'string' && !isPrivateIp(cfIp)) return cfIp.trim();

  const realIp = req.headers['x-real-ip'];
  if (realIp && typeof realIp === 'string' && !isPrivateIp(realIp)) return realIp.trim();

  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    const ips = forwarded.split(',').map(ip => ip.trim());
    for (const candidate of ips) {
      if (candidate && !isPrivateIp(candidate)) return candidate;
    }
    if (ips[0]) return ips[0].trim();
  }

  const socketIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  if (socketIp) return socketIp.replace(/^::ffff:/, '').trim();

  return '127.0.0.1';
}

async function resolveGeo(ip) {
  let cleanIp = ip.replace(/^::ffff:/, '').trim();
  if (isPrivateIp(cleanIp)) {
    const devIp = await getDevPublicIp();
    if (devIp) cleanIp = devIp;
  }

  if (geoCache.has(cleanIp)) return geoCache.get(cleanIp);

  let countryName = 'India';
  let stateName = 'Uttar Pradesh';
  let cityName = 'Ayodhya';

  try {
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,region,regionName,city`, { signal: AbortSignal.timeout(2500) });
    const apiData = await res.json();
    if (apiData && apiData.status === 'success') {
      countryName = apiData.country || 'India';
      stateName = apiData.regionName || STATE_NAMES[apiData.region?.toUpperCase()] || apiData.region || 'Uttar Pradesh';
      cityName = apiData.city || 'Ayodhya';
    }
  } catch (err) {
    try {
      const res2 = await fetch(`https://ipwho.is/${cleanIp}`, { signal: AbortSignal.timeout(2500) });
      const apiData2 = await res2.json();
      if (apiData2 && apiData2.success) {
        countryName = apiData2.country || 'India';
        stateName = apiData2.region || 'Uttar Pradesh';
        cityName = apiData2.city || 'Ayodhya';
      }
    } catch (e2) {}
  }

  const finalResult = {
    country: countryName || 'India',
    state: stateName || 'Uttar Pradesh',
    city: cityName || 'Ayodhya'
  };

  if (geoCache.size > 10000) geoCache.clear();
  geoCache.set(cleanIp, finalResult);
  return finalResult;
}

function parseUA(uaString) {
  if (!uaString) return { browser: 'Chrome', os: 'Windows', deviceType: 'desktop' };
  const ua = uaString.toLowerCase();

  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet';
  }

  let browser = 'Other';
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  let os = 'Other';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) os = 'iOS';
  else if (ua.includes('linux')) os = 'Linux';

  return { browser, os, deviceType };
}

function formatMaskedIp(ip) {
  if (!ip || ip === 'Unknown' || ip === '127.0.0.1') return '127.0.xx.xx';
  const parts = String(ip).trim().split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.xx.${parts[3]}`;
  return ip;
}

async function getOptionalUser(req) {
  let token = req.cookies?.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.substring(7);
  }
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return await userModel.findById(decoded._id).select('name username contact role');
  } catch (e) {
    return null;
  }
}

// ============================================
// PUBLIC TELEMETRY ENDPOINTS
// ============================================

// POST /api/analytics/track-visit
router.post('/track-visit', async (req, res) => {
  try {
    const {
      visitId: rawVisitId,
      sessionId: rawSessionId,
      visitorId: rawVisitorId,
      path: rawPath,
      pageTitle,
      referrer,
      firstTouch,
      lastTouch
    } = req.body;

    if (!rawPath) return res.status(400).json({ success: false, message: 'path is required' });

    const path = String(rawPath).substring(0, 500);
    const visitorId = String(rawVisitorId || `vtr_${crypto.randomBytes(8).toString('hex')}`);
    const sessionId = String(rawSessionId || `ses_${crypto.randomBytes(8).toString('hex')}`);
    const visitId = String(rawVisitId || `vst_${crypto.randomBytes(8).toString('hex')}`);

    const clientIp = getClientIp(req);
    const geo = await resolveGeo(clientIp);
    const uaString = req.headers['user-agent'] || '';
    const uaInfo = parseUA(uaString);

    const isBot = /bot|crawl|slurp|spider|mediapartners|googlebot|bingbot|yandex/i.test(uaString);
    const botName = isBot ? (uaString.match(/(Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider)/i)?.[0] || 'Crawler') : null;

    const authUser = await getOptionalUser(req);

    const newLog = await VisitLog.create({
      visitId,
      sessionId,
      visitorId,
      user: authUser?._id || null,
      userRole: authUser?.role || 'guest',
      userName: authUser?.name || null,
      userEmail: authUser?.contact || null,
      path,
      pageTitle: pageTitle ? String(pageTitle).substring(0, 300) : '',
      ip: clientIp,
      country: geo.country,
      state: geo.state,
      city: geo.city,
      deviceType: uaInfo.deviceType,
      browser: uaInfo.browser,
      os: uaInfo.os,
      referrer: referrer ? String(referrer).substring(0, 300) : 'Direct',
      isBot,
      botName,
      firstTouch: firstTouch || null,
      lastTouch: lastTouch || null,
      durationSeconds: 0,
      lastReportedActiveSeconds: 0
    });

    res.json({
      success: true,
      visitId: newLog.visitId,
      sessionId: newLog.sessionId
    });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/analytics/track-duration
router.post('/track-duration', async (req, res) => {
  try {
    const { visitId, activeSeconds } = req.body;
    if (!visitId || activeSeconds === undefined) {
      return res.status(400).json({ success: false, message: 'visitId and activeSeconds required' });
    }

    const duration = Math.min(Math.max(0, Number(activeSeconds)), 86400);

    await VisitLog.findOneAndUpdate(
      { visitId },
      {
        $max: {
          durationSeconds: duration,
          lastReportedActiveSeconds: duration
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track duration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ADMIN REPORTING STATS (Protected)
// ============================================

router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const { range = '30days', startDate, endDate, state, city, path, isBot } = req.query;

    const matchQuery = {};

    // Date range filter
    const now = new Date();
    if (range === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchQuery.createdAt = { $gte: startOfDay };
    } else if (range === 'yesterday') {
      const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchQuery.createdAt = { $gte: yesterdayStart, $lt: yesterdayEnd };
    } else if (range === '1week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchQuery.createdAt = { $gte: weekAgo };
    } else if (range === '30days') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      matchQuery.createdAt = { $gte: monthAgo };
    } else if (range === 'custom' && startDate && endDate) {
      matchQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Bot filter
    if (isBot !== 'true') {
      matchQuery.isBot = { $ne: true };
    }

    // Specific filters
    if (state) matchQuery.state = { $regex: state, $options: 'i' };
    if (city) matchQuery.city = { $regex: city, $options: 'i' };
    if (path) matchQuery.path = { $regex: path, $options: 'i' };

    // 1. Summary Metrics
    const totalPageviews = await VisitLog.countDocuments(matchQuery);

    const [uniqueVisitorsResult, uniqueSessionsResult, avgDurationResult] = await Promise.all([
      VisitLog.distinct('visitorId', matchQuery),
      VisitLog.distinct('sessionId', matchQuery),
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, avgDur: { $avg: '$durationSeconds' } } }
      ])
    ]);

    const uniqueVisitors = uniqueVisitorsResult.length;
    const totalSessions = uniqueSessionsResult.length;
    const avgDuration = Math.round(avgDurationResult[0]?.avgDur || 0);

    // Live Visitors (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const liveVisitors = await VisitLog.distinct('visitorId', {
      createdAt: { $gte: fiveMinutesAgo },
      isBot: { $ne: true }
    });

    // 2. Locations: States and Cities
    const [byState, byCity] = await Promise.all([
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$state', count: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } },
        { $project: { state: '$_id', count: 1, uniqueVisitors: { $size: '$visitors' } } },
        { $sort: { count: -1 } },
        { $limit: 15 }
      ]),
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$city', state: { $first: '$state' }, count: { $sum: 1 } } },
        { $project: { city: '$_id', state: 1, count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 15 }
      ])
    ]);

    // 3. Top Pages
    const topPages = await VisitLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$path',
          views: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
          avgDuration: { $avg: '$durationSeconds' }
        }
      },
      {
        $project: {
          path: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$visitors' },
          avgDuration: { $round: ['$avgDuration', 0] }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 20 }
    ]);

    // 4. Device and Browser Split
    const [devices, browsers, osSplit] = await Promise.all([
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),
      VisitLog.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ])
    ]);

    // 5. Recent Visit Logs (Last 40 visits)
    const rawLogs = await VisitLog.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(40)
      .select('visitId visitorId userName userRole path pageTitle ip city state country deviceType browser os durationSeconds createdAt');

    const recentLogs = rawLogs.map(log => ({
      visitId: log.visitId,
      visitorId: log.visitorId,
      userName: log.userName || (log.userRole !== 'guest' ? log.userRole : 'Guest'),
      userRole: log.userRole,
      path: log.path,
      pageTitle: log.pageTitle,
      ip: formatMaskedIp(log.ip),
      city: log.city,
      state: log.state,
      country: log.country,
      deviceType: log.deviceType,
      browser: log.browser,
      os: log.os,
      durationSeconds: log.durationSeconds || 0,
      createdAt: log.createdAt
    }));

    res.json({
      success: true,
      summary: {
        totalPageviews,
        uniqueVisitors,
        totalSessions,
        avgDurationSeconds: avgDuration,
        liveVisitors: liveVisitors.length
      },
      locations: {
        byState,
        byCity
      },
      pages: topPages,
      tech: {
        devices,
        browsers,
        os: osSplit
      },
      recentLogs
    });
  } catch (error) {
    console.error('Get analytics stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
