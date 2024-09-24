import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import argon2 from "argon2"; // Importar argon2
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenService";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userid = randomUUID();
  
  try {
    // Hashear la contraseña con Argon2
    const hashedPassword = await argon2.hash(password);

    // Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        userid,
        email,
        money: 10000,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    // Generar tokens
    const token = generateToken(newUser.userid);
    const refreshToken = generateRefreshToken(newUser.userid);

    // Incluir el token en el header de la respuesta
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json({ message: "Usuario creado exitosamente", refreshToken });
  
  } catch (error) {
    console.error("Error al crear el usuario o la cuenta:", error);
  
    res.status(500).json({ error: "Error al crear el usuario o la cuenta" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Comparar la contraseña con Argon2
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar tokens
    const token = generateToken(user.userid);
    const refreshToken = generateRefreshToken(user.userid);

    // Incluir el token en el header de la respuesta
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Inicio de sesión exitoso", refreshToken });
  
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token requerido" });
    }

    // Verificar el refresh token
    const decoded = verifyRefreshToken(refreshToken) as { userId: string };
    if (!decoded) {
      return res.status(403).json({ error: "Refresh token inválido" });
    }

    // Generar un nuevo token
    const newToken = generateToken(decoded.userId);
    res.status(200).json({ token: newToken });
  
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    res.status(500).json({ error: "Error al refrescar el token" });
  }
};
