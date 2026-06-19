const authMiddleware = {
    requerirLogin: (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            return res.redirect('/auth/login');
        }
        next();
    },

    permitirRoles: (rolesPermitidos) => {
        return (req, res, next) => {
            if (!req.session || !req.session.usuario) {
                return res.redirect('/auth/login');
            }
            if (!rolesPermitidos.includes(req.session.usuario.rol)) {
                return res.status(403).render('403', { title: 'Acceso Denegado' });
            }
            next();
        };
    }
};

module.exports = authMiddleware;
