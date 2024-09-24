"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const tokenService_1 = require("../utils/tokenService"); // Asegúrate de que esta ruta sea correcta
const authenticateToken = (req, res, next) => {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    // Si no hay encabezado de autorización o no contiene un token, devuelve estado 401
    if (!authHeader)
        return res.sendStatus(401);
    // Extraer el token del encabezado (se espera que el formato sea 'Bearer token')
    const token = authHeader.split(' ')[1];
    // Si no hay token, devuelve estado 401
    if (!token)
        return res.sendStatus(401);
    try {
        // Verificar el token y asignar el usuario al objeto de solicitud
        const user = (0, tokenService_1.verifyToken)(token); // Ajusta el tipo si es necesario
        req.user = user;
        next(); // Continúa con el siguiente middleware o ruta
    }
    catch (error) {
        // Si la verificación falla, devuelve estado 403
        console.error('Error al verificar el token:', error);
        res.sendStatus(403);
    }
};
exports.authenticateToken = authenticateToken;
