import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import argon2 from "argon2"; 
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenService";

const prisma = new PrismaClient();

// Regex para validar email, contraseña y nombre
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[A-Za-z\s]+$/;

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userid = randomUUID();
  
  // Validaciones
  if (!nameRegex.test(name)) {
    return res.status(400).json({ error: "Nombre no válido" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email no válido" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo" });
  }

  try {
    const hashedPassword = await argon2.hash(password);

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

    const token = generateToken(newUser.userid);
    const refreshToken = generateRefreshToken(newUser.userid);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json({ message: "Usuario creado exitosamente", refreshToken });
  
  } catch (error) {
    console.error("Error al crear el usuario o la cuenta:", error);
    res.status(500).json({ error: "Error al crear el usuario o la cuenta" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validaciones
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email no válido" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Contraseña no válida" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken(user.userid);
    const refreshToken = generateRefreshToken(user.userid);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Inicio de sesión exitoso", refreshToken });
  
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};


