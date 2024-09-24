import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenService'; // Asegúrate de que esta ruta sea correcta

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string }; // Ajusta este tipo según la estructura de tu token
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Obtener el encabezado de autorización
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  // Si no hay encabezado de autorización o no contiene un token, devuelve estado 401
  if (!authHeader) return res.sendStatus(401);

  // Extraer el token del encabezado (se espera que el formato sea 'Bearer token')
  const token = authHeader.split(' ')[1];

  // Si no hay token, devuelve estado 401
  if (!token) return res.sendStatus(401);

  try {
    // Verificar el token y asignar el usuario al objeto de solicitud
    const user = verifyToken(token) as { userId: string }; // Ajusta el tipo si es necesario
    req.user = user;
    next(); // Continúa con el siguiente middleware o ruta
  } catch (error) {
    // Si la verificación falla, devuelve estado 403
    console.error('Error al verificar el token:', error);
    res.sendStatus(403);
  }
};
