import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Usa tu secreto aquí
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'; // Secreto para el refresh token

// Función para generar un token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' }); // Token principal expira en 1 hora
};

// Función para generar un refresh token
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh token expira en 7 días
};

// Función para verificar un token
export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
  };
  
// Función para verificar un refresh token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const getUserIdFromToken = (token: string) => {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId; // Asegúrate de que el token contenga el userId
  } catch (error) {
    throw new Error("Token inválido");
  }
};