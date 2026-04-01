const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const fs = require('fs');

const doc = {
    info: {
        title: 'Ramji Ki Sena API',
        version: '1.0.0',
        description: 'Auto-generated API documentation for the Ramji Ki Sena platform',
        contact: { name: 'API Support' },
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Development Server' },
        { url: 'https://ramjikisena.com', description: 'Production Server' },
    ],

    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            // ── Pandit Auth ──────────────────────────────────────────────
            PanditRegister: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password'],
                properties: {
                    name: { type: 'string', example: 'Pandit Ram Sharma' },
                    email: { type: 'string', example: 'pandit@example.com' },
                    phone: { type: 'string', example: '9876543210' },
                    password: { type: 'string', example: 'Strong@123' }
                }
            },
            PanditLogin: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', example: 'pandit@example.com' },
                    password: { type: 'string', example: 'Strong@123' }
                }
            },
            ChangePassword: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                    currentPassword: { type: 'string', example: 'OldPass@1' },
                    newPassword: { type: 'string', example: 'NewPass@2' }
                }
            },

            // ── Pandit Profile ───────────────────────────────────────────
            PanditUpdate: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    phone: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    address: { type: 'string' },
                    specialization: { type: 'array', items: { type: 'string' } },
                    experience: { type: 'number', example: 10 },
                    bio: { type: 'string' }
                }
            },

            // ── Katha Vachak ─────────────────────────────────────────────
            KathaVachakCreate: {
                type: 'object',
                required: ['name', 'phone'],
                properties: {
                    name: { type: 'string', example: 'Vachak Ji' },
                    phone: { type: 'string', example: '9876543210' },
                    email: { type: 'string', example: 'vachak@example.com' },
                    city: { type: 'string' },
                    specialization: { type: 'array', items: { type: 'string' } },
                    experience: { type: 'number', example: 5 },
                    bio: { type: 'string' }
                }
            },
            KathaVachakUpdate: { $ref: '#/components/schemas/KathaVachakCreate' },

            // ── Pandit (public listing) ───────────────────────────────────
            PanditCreate: {
                type: 'object',
                required: ['name', 'phone'],
                properties: {
                    name: { type: 'string', example: 'Pandit Ji' },
                    phone: { type: 'string', example: '9876543210' },
                    email: { type: 'string', example: 'pandit@example.com' },
                    city: { type: 'string' },
                    specialization: { type: 'array', items: { type: 'string' } },
                    experience: { type: 'number', example: 10 },
                    bio: { type: 'string' }
                }
            },
            PanditUpdateBody: { $ref: '#/components/schemas/PanditCreate' },

            // ── Booking ───────────────────────────────────────────────────
            BookingCreate: {
                type: 'object',
                required: ['panditId', 'bookingDate', 'poojaType'],
                properties: {
                    panditId: { type: 'string', example: '65f0c1...' },
                    bookingDate: { type: 'string', format: 'date', example: '2026-04-10' },
                    poojaType: { type: 'string', example: 'Satyanarayan Katha' },
                    startTime: { type: 'string', example: '10:00 AM' },
                    address: { type: 'string' },
                    city: { type: 'string' },
                    notes: { type: 'string' },
                    customerDetails: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            email: { type: 'string' },
                            phone: { type: 'string' }
                        }
                    }
                }
            },
            BookingUpdateStatus: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] }
                }
            },
            BookingCancel: {
                type: 'object',
                properties: { reason: { type: 'string' } }
            },

            // ── Upload ────────────────────────────────────────────────────
            UploadBase64: {
                type: 'object',
                required: ['file'],
                properties: {
                    file: { type: 'string', description: 'base64 encoded data URL' },
                    folder: { type: 'string', example: 'documents' }
                }
            }
        },
    },

    security: [{ bearerAuth: [] }],

    tags: [
        { name: 'PanditAuth', description: 'Pandit authentication & registration' },
        { name: 'PanditDashboard', description: 'Pandit dashboard operations' },
        { name: 'KathaVachaks', description: 'Katha Vachak management' },
        { name: 'Pandits', description: 'Pandit listing & management' },
        { name: 'Bookings', description: 'Booking management' },
        { name: 'Samagri', description: 'Samagri (pooja materials) management' },
        { name: 'Community', description: 'Community management' },
        { name: 'Forum', description: 'Forum management' },
        { name: 'Upload', description: 'File / image uploads' },
    ],
};

// ─── Prefix → Tag (longest first to avoid partial matches) ───────────────────
const TAG_MAP = [
    { prefix: '/api/pandit-dashboard', tag: 'PanditDashboard' },
    { prefix: '/api/pandit-auth', tag: 'PanditAuth' },
    { prefix: '/api/katha-vachaks', tag: 'KathaVachaks' },
    { prefix: '/api/bookings', tag: 'Bookings' },
    { prefix: '/api/pandits', tag: 'Pandits' },
    { prefix: '/api/samagri', tag: 'Samagri' },
    { prefix: '/api/community', tag: 'Community' },
    { prefix: '/api/forum', tag: 'Forum' },
    { prefix: '/api/upload', tag: 'Upload' },
];

function assignTagsFromPaths(outputFile) {
    const spec = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

    for (const [routePath, methods] of Object.entries(spec.paths || {})) {
        const match = TAG_MAP.find(({ prefix }) => routePath.startsWith(prefix));
        if (!match) continue;

        for (const operation of Object.values(methods)) {
            if (typeof operation !== 'object' || Array.isArray(operation)) continue;
            operation.tags = [match.tag];
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(spec, null, 2));
    console.log('🏷️   Tags auto-assigned from URL prefixes');
}

function augmentSpec(outputFile) {
    const spec = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

    // Public endpoints (no auth required)
    const publicEndpoints = new Set([
        'post /api/pandit-auth/register',
        'post /api/pandit-auth/login',
        'get /api/katha-vachaks',
        'get /api/katha-vachaks/{id}',
        'get /api/pandits',
        'get /api/pandits/{id}',
        'get /health',
        'get /',
    ]);

    // Operation summaries and request bodies
    const opMap = {
        // Pandit Auth
        'post /api/pandit-auth/register': {
            summary: 'Register new pandit',
            requestBody: { $ref: '#/components/schemas/PanditRegister' }
        },
        'post /api/pandit-auth/login': {
            summary: 'Login pandit',
            requestBody: { $ref: '#/components/schemas/PanditLogin' }
        },
        'put /api/pandit-auth/change-password': {
            summary: 'Change pandit password',
            requestBody: { $ref: '#/components/schemas/ChangePassword' }
        },
        'put /api/pandit-auth/update-profile': {
            summary: 'Update pandit profile',
            requestBody: { $ref: '#/components/schemas/PanditUpdate' }
        },

        // Katha Vachaks
        'post /api/katha-vachaks': {
            summary: 'Create katha vachak',
            requestBody: { $ref: '#/components/schemas/KathaVachakCreate' }
        },
        'put /api/katha-vachaks/{id}': {
            summary: 'Update katha vachak',
            requestBody: { $ref: '#/components/schemas/KathaVachakUpdate' }
        },

        // Pandits
        'post /api/pandits': {
            summary: 'Create pandit listing',
            requestBody: { $ref: '#/components/schemas/PanditCreate' }
        },
        'put /api/pandits/{id}': {
            summary: 'Update pandit listing',
            requestBody: { $ref: '#/components/schemas/PanditUpdateBody' }
        },

        // Bookings
        'post /api/bookings': {
            summary: 'Create booking',
            requestBody: { $ref: '#/components/schemas/BookingCreate' }
        },
        'put /api/bookings/{id}/status': {
            summary: 'Update booking status',
            requestBody: { $ref: '#/components/schemas/BookingUpdateStatus' }
        },
        'put /api/bookings/{id}/cancel': {
            summary: 'Cancel booking',
            requestBody: { $ref: '#/components/schemas/BookingCancel' }
        },

        // Upload
        'post /api/upload/image': {
            summary: 'Upload image (base64)',
            requestBody: { $ref: '#/components/schemas/UploadBase64' }
        },
        'post /api/upload/document': {
            summary: 'Upload document (base64)',
            requestBody: { $ref: '#/components/schemas/UploadBase64' }
        },
        'post /api/upload': {
            summary: 'Upload file (multipart/form-data)',
            multipart: true
        },
    };

    for (const [path, methods] of Object.entries(spec.paths || {})) {
        for (const [method, operation] of Object.entries(methods)) {
            if (typeof operation !== 'object' || Array.isArray(operation)) continue;
            const key = `${method.toLowerCase()} ${path}`;

            // Remove security for public endpoints
            if (publicEndpoints.has(key)) {
                operation.security = [];
            }

            // Add summary & requestBody
            const conf = opMap[key];
            if (conf) {
                if (conf.summary) operation.summary = conf.summary;
                if (conf.requestBody) {
                    operation.requestBody = {
                        required: true,
                        content: {
                            'application/json': {
                                schema: conf.requestBody
                            }
                        }
                    };
                }
                if (conf.multipart) {
                    operation.requestBody = {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: { type: 'string', format: 'binary' },
                                        folder: { type: 'string' }
                                    },
                                    required: ['file']
                                }
                            }
                        }
                    };
                }
            }
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(spec, null, 2));
    console.log('🧩  Spec augmented with summaries, request bodies and security rules');
}

// ─────────────────────────────────────────────────────────────────────────────

const outputFile = './swagger-output.json';
const routes = ['./app.js'];          // your entry file

swaggerAutogen(outputFile, routes, doc).then(() => {
    assignTagsFromPaths(outputFile);
    augmentSpec(outputFile);
    console.log('✅  swagger-output.json generated successfully');
});