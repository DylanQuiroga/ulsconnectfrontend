const fs = require('fs');
const path = require('path');

const authPath = path.join('C:', 'Users', 'Usuario', 'Desktop', 'ulsconnectbacken', 'routes', 'auth.js');

try {
    let content = fs.readFileSync(authPath, 'utf8');

    // 1. Fix POST /login to include all fields in session
    const loginOld = `        req.session.user = {
            id: user._id,
            correoUniversitario: user.correoUniversitario,
            nombre: user.nombre,
            role: user.rol || user.role || 'estudiante'
        };`;

    const loginNew = `        req.session.user = {
            id: user._id,
            correoUniversitario: user.correoUniversitario,
            nombre: user.nombre,
            role: user.rol || user.role || 'estudiante',
            telefono: user.telefono || null,
            carrera: user.carrera || '',
            intereses: Array.isArray(user.intereses) ? user.intereses : [],
            comuna: user.comuna || '',
            direccion: user.direccion || '',
            edad: user.edad || null,
            status: user.status || ''
        };`;

    if (content.includes(loginOld)) {
        content = content.replace(loginOld, loginNew);
        console.log('✅ Fixed POST /login session data');
    } else {
        console.log('⚠️ Could not find exact match for POST /login session data (might be already patched)');
    }

    // 2. Fix GET /profile to fetch from DB
    const profileOld = `// GET /profile - Get current user profile (protected)
router.get('/profile', ensureAuth, (req, res) => {
    res.json({
        success: true,
        user: req.session.user
    });
});`;

    const profileNew = `// GET /profile - Get current user profile (protected)
router.get('/profile', ensureAuth, async (req, res) => {
    try {
        // Fetch fresh data from DB to ensure session is up to date
        const user = await userModel.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Update session with fresh data
        req.session.user = {
            id: user._id,
            correoUniversitario: user.correoUniversitario,
            nombre: user.nombre,
            role: user.rol || user.role || 'estudiante',
            telefono: user.telefono || null,
            carrera: user.carrera || '',
            intereses: Array.isArray(user.intereses) ? user.intereses : [],
            comuna: user.comuna || '',
            direccion: user.direccion || '',
            edad: user.edad || null,
            status: user.status || ''
        };

        res.json({
            success: true,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ success: false, message: 'Error al obtener perfil', error: err.message });
    }
});`;

    // Normalize line endings for comparison just in case
    const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
    
    if (content.replace(/\r\n/g, '\n').includes(normalize(profileOld))) {
        // We need to be careful with replace since normalize removes whitespace
        // Let's try a more robust replace using the original string structure
        content = content.replace(profileOld, profileNew);
        console.log('✅ Fixed GET /profile to fetch from DB');
    } else {
        // Fallback: try to find it with slightly different formatting or just the body
        const simpleProfileOld = `router.get('/profile', ensureAuth, (req, res) => {
    res.json({
        success: true,
        user: req.session.user
    });
});`;
        if (content.includes(simpleProfileOld)) {
             content = content.replace(simpleProfileOld, profileNew.replace('// GET /profile - Get current user profile (protected)\n', ''));
             console.log('✅ Fixed GET /profile (simple match)');
        } else {
             console.log('⚠️ Could not find GET /profile route to patch');
        }
    }

    fs.writeFileSync(authPath, content, 'utf8');
    console.log('🎉 Successfully patched auth.js');

} catch (err) {
    console.error('❌ Error patching auth.js:', err);
}
