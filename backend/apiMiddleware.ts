import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Plugin, ViteDevServer } from 'vite';

interface FarmerRecord {
  id: number;
  name: string;
  mobile: string;
  email: string;
  password_hash: string;
  village: string;
  district: string;
  state: string;
  language: string;
  farm_size_acres: number;
  created_at: string;
}

const DB_DIR = path.resolve(__dirname, 'database');
const FARMERS_FILE = path.resolve(DB_DIR, 'farmers.json');
const SESSIONS_FILE = path.resolve(DB_DIR, 'sessions.json');

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(FARMERS_FILE)) {
    // Seed initial demo farmer without hardcoded name
    const initialFarmers: FarmerRecord[] = [
      {
        id: 1,
        name: 'Demo Farmer',
        mobile: '9876543210',
        email: 'farmer.demo@kisansetu.in',
        password_hash: hashPassword('kisan123'),
        village: 'Kishanpur',
        district: 'Ludhiana',
        state: 'Punjab',
        language: 'en',
        farm_size_acres: 5.0,
        created_at: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(FARMERS_FILE, JSON.stringify(initialFarmers, null, 2), 'utf-8');
  }

  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}, null, 2), 'utf-8');
  }
}

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'kisan_salt_2026', 1000, 32, 'sha256').toString('hex');
}

function readFarmers(): FarmerRecord[] {
  try {
    ensureDb();
    const content = fs.readFileSync(FARMERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeFarmers(farmers: FarmerRecord[]) {
  ensureDb();
  fs.writeFileSync(FARMERS_FILE, JSON.stringify(farmers, null, 2), 'utf-8');
}

function readSessions(): Record<string, number> {
  try {
    ensureDb();
    const content = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, number>) {
  ensureDb();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

function getSessionToken(req: any): string | null {
  // Check cookie or header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c: string) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith('kisan_session=')) {
        return cookie.substring('kisan_session='.length);
      }
    }
  }

  // Also check custom header
  if (req.headers['x-kisan-session']) {
    return req.headers['x-kisan-session'];
  }

  return null;
}

function cleanFarmer(farmer: FarmerRecord) {
  const { password_hash, ...rest } = farmer;
  return rest;
}

export function kisanBackendPlugin(): Plugin {
  return {
    name: 'kisan-backend-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api')) {
          return next();
        }

        // Helper to send JSON
        const sendJson = (statusCode: number, data: any, setCookieToken?: string) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Kisan-Session');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          if (setCookieToken !== undefined) {
            if (setCookieToken === '') {
              res.setHeader('Set-Cookie', 'kisan_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
            } else {
              res.setHeader('Set-Cookie', `kisan_session=${setCookieToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
            }
          }
          res.end(JSON.stringify(data));
        };

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Kisan-Session');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          return res.end();
        }

        // Parse JSON body
        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', () => {
          let body: any = {};
          if (bodyRaw) {
            try {
              body = JSON.parse(bodyRaw);
            } catch {
              body = {};
            }
          }

          const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
          const pathname = parsedUrl.pathname;

          // 1. GET /api/auth/me
          if (pathname === '/api/auth/me' && req.method === 'GET') {
            const token = getSessionToken(req);
            if (!token) {
              return sendJson(200, { logged_in: false, user: null });
            }
            const sessions = readSessions();
            const farmerId = sessions[token];
            if (!farmerId) {
              return sendJson(200, { logged_in: false, user: null });
            }
            const farmers = readFarmers();
            const farmer = farmers.find((f) => f.id === farmerId);
            if (!farmer) {
              delete sessions[token];
              writeSessions(sessions);
              return sendJson(200, { logged_in: false, user: null });
            }
            const cleaned = cleanFarmer(farmer);
            return sendJson(200, {
              logged_in: true,
              user: cleaned,
              farmer: cleaned,
            });
          }

          // 2. GET /api/auth/session (alias)
          if (pathname === '/api/auth/session' && req.method === 'GET') {
            const token = getSessionToken(req);
            if (!token) {
              return sendJson(200, { authenticated: false, logged_in: false });
            }
            const sessions = readSessions();
            const farmerId = sessions[token];
            const farmers = readFarmers();
            const farmer = farmers.find((f) => f.id === farmerId);
            if (!farmer) {
              return sendJson(200, { authenticated: false, logged_in: false });
            }
            const cleaned = cleanFarmer(farmer);
            return sendJson(200, {
              authenticated: true,
              logged_in: true,
              farmer: cleaned,
              user: cleaned,
            });
          }

          // 3. POST /api/auth/register
          if (pathname === '/api/auth/register' && req.method === 'POST') {
            const name = (body.name || '').trim();
            const mobile = (body.mobile || '').trim();
            const email = (body.email || '').trim();
            const password = (body.password || '').trim();
            const village = (body.village || '').trim();
            const district = (body.district || '').trim();
            const state = (body.state || '').trim();
            const language = (body.language || 'en').trim();
            const farmSize = parseFloat(body.farm_size_acres) || 4.5;

            if (!name || !mobile || !password || !village || !district || !state) {
              return sendJson(400, {
                error: 'Please fill in all mandatory fields (Name, Mobile, Password, Village, District, State)',
                message: 'Please fill in all mandatory fields.',
              });
            }

            if (mobile.length < 10) {
              return sendJson(400, {
                error: 'Mobile number must be at least 10 digits',
                message: 'Mobile number must be at least 10 digits',
              });
            }

            const farmers = readFarmers();
            // Check if mobile already exists
            const existingMobile = farmers.find((f) => f.mobile === mobile);
            if (existingMobile) {
              return sendJson(409, {
                error: 'Mobile number already registered. Please login.',
                message: 'Mobile number already registered. Please login.',
              });
            }

            // Create new record
            const newFarmer: FarmerRecord = {
              id: Date.now(),
              name,
              mobile,
              email: email || `${mobile}@farmer.kisansetu.in`,
              password_hash: hashPassword(password),
              village,
              district,
              state,
              language,
              farm_size_acres: farmSize,
              created_at: new Date().toISOString(),
            };

            farmers.push(newFarmer);
            writeFarmers(farmers);

            // Create session
            const sessionToken = crypto.randomBytes(24).toString('hex');
            const sessions = readSessions();
            sessions[sessionToken] = newFarmer.id;
            writeSessions(sessions);

            const cleaned = cleanFarmer(newFarmer);
            return sendJson(
              201,
              {
                success: true,
                message: 'Registration successful! Welcome to Kisan Setu.',
                logged_in: true,
                token: sessionToken,
                farmer: cleaned,
                user: cleaned,
              },
              sessionToken
            );
          }

          // 4. POST /api/auth/login
          if (pathname === '/api/auth/login' && req.method === 'POST') {
            const identifier = (body.mobile_or_email || body.mobile || body.email || '').trim();
            const password = (body.password || '').trim();

            if (!identifier || !password) {
              return sendJson(400, {
                error: 'Invalid email/mobile or password.',
                message: 'Invalid email/mobile or password.',
              });
            }

            const farmers = readFarmers();
            const farmer = farmers.find((f) => f.mobile === identifier || f.email.toLowerCase() === identifier.toLowerCase());

            if (!farmer) {
              // As mandated: "If credentials are incorrect, show: Invalid email/mobile or password."
              return sendJson(401, {
                error: 'Invalid email/mobile or password.',
                message: 'Invalid email/mobile or password.',
              });
            }

            const inputHash = hashPassword(password);
            // Allow matching hash or demo password for demo accounts
            const passwordMatches = farmer.password_hash === inputHash || (password === 'kisan123' && farmer.mobile === '9876543210');

            if (!passwordMatches) {
              return sendJson(401, {
                error: 'Invalid email/mobile or password.',
                message: 'Invalid email/mobile or password.',
              });
            }

            // Create session
            const sessionToken = crypto.randomBytes(24).toString('hex');
            const sessions = readSessions();
            sessions[sessionToken] = farmer.id;
            writeSessions(sessions);

            const cleaned = cleanFarmer(farmer);
            return sendJson(
              200,
              {
                success: true,
                message: `Welcome, ${farmer.name}`,
                logged_in: true,
                token: sessionToken,
                farmer: cleaned,
                user: cleaned,
              },
              sessionToken
            );
          }

          // 5. POST /api/auth/logout
          if (pathname === '/api/auth/logout' && req.method === 'POST') {
            const token = getSessionToken(req);
            if (token) {
              const sessions = readSessions();
              delete sessions[token];
              writeSessions(sessions);
            }
            return sendJson(200, { success: true, message: 'Logged out successfully' }, '');
          }

          // 6. GET /api/farmer/profile
          if (pathname === '/api/farmer/profile' && req.method === 'GET') {
            const token = getSessionToken(req);
            if (!token) {
              return sendJson(401, { error: 'Unauthorized. Please login.', authenticated: false });
            }
            const sessions = readSessions();
            const farmerId = sessions[token];
            const farmers = readFarmers();
            const farmer = farmers.find((f) => f.id === farmerId);
            if (!farmer) {
              return sendJson(401, { error: 'Unauthorized. Farmer not found.', authenticated: false });
            }
            return sendJson(200, { success: true, profile: cleanFarmer(farmer) });
          }

          // 7. PUT /api/farmer/profile
          if (pathname === '/api/farmer/profile' && req.method === 'PUT') {
            const token = getSessionToken(req);
            if (!token) {
              return sendJson(401, { error: 'Unauthorized. Please login.', authenticated: false });
            }
            const sessions = readSessions();
            const farmerId = sessions[token];
            const farmers = readFarmers();
            const idx = farmers.findIndex((f) => f.id === farmerId);
            if (idx === -1) {
              return sendJson(401, { error: 'Unauthorized. Farmer not found.', authenticated: false });
            }

            const current = farmers[idx];
            if (body.name && body.name.trim()) current.name = body.name.trim();
            if (body.email !== undefined) current.email = body.email.trim();
            if (body.village && body.village.trim()) current.village = body.village.trim();
            if (body.district && body.district.trim()) current.district = body.district.trim();
            if (body.state && body.state.trim()) current.state = body.state.trim();
            if (body.language && body.language.trim()) current.language = body.language.trim();
            if (body.farm_size_acres !== undefined) current.farm_size_acres = parseFloat(body.farm_size_acres) || current.farm_size_acres;

            farmers[idx] = current;
            writeFarmers(farmers);

            return sendJson(200, {
              success: true,
              message: 'Profile updated successfully',
              profile: cleanFarmer(current),
            });
          }

          // Pass other API routes to next or default
          next();
        });
      });
    },
  };
}
