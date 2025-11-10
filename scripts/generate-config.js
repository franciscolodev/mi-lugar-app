    const fs = require('fs');
    const path = require('path');

    try {
    require('dotenv').config();
    } catch (e) {
    // dotenv es devDependency; si no existe, continúa con process.env
    }

    const outPath = path.join(__dirname, '..', 'public', 'config.js');

    // Vars (FIREBASE_CONFIG debe ser JSON string)
    const firebaseConfigRaw = process.env.FIREBASE_CONFIG || '';
    let firebaseConfig = {};

    if (firebaseConfigRaw) {
    try {
        firebaseConfig = JSON.parse(firebaseConfigRaw);
    } catch (err) {
        console.warn('FIREBASE_CONFIG no es JSON válido. Se escribirá como string.', err);
        firebaseConfig = firebaseConfigRaw;
    }
    }

    const appId = process.env.APP_ID || 'default-app-id';
    const initialAuthToken = process.env.INITIAL_AUTH_TOKEN || null;
    const ytKey = process.env.YT_API_KEY || '';

    // Contenido inyectado
    const content = `// Este archivo fue generado por scripts/generate-config.js
    window.__app_id = ${JSON.stringify(appId)};
    window.__firebase_config = ${JSON.stringify(firebaseConfig)};
    window.__initial_auth_token = ${JSON.stringify(initialAuthToken)};
    window.__YT_API_KEY = ${JSON.stringify(ytKey)};
    `;

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content, { encoding: 'utf8' });

    console.log('public/config.js generado correctamente.');
