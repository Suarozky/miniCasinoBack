"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const argon2_1 = __importDefault(require("argon2")); // Importar argon2
const tokenService_1 = require("../utils/tokenService");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userid = (0, crypto_1.randomUUID)();
    try {
        // Hashear la contraseña con Argon2
        const hashedPassword = yield argon2_1.default.hash(password);
        // Crear el nuevo usuario
        const newUser = yield prisma.user.create({
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
        const token = (0, tokenService_1.generateToken)(newUser.userid);
        const refreshToken = (0, tokenService_1.generateRefreshToken)(newUser.userid);
        // Incluir el token en el header de la respuesta
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(201).json({ message: "Usuario creado exitosamente", refreshToken });
    }
    catch (error) {
        console.error("Error al crear el usuario o la cuenta:", error);
        res.status(500).json({ error: "Error al crear el usuario o la cuenta" });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        // Comparar la contraseña con Argon2
        const isMatch = yield argon2_1.default.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        // Generar tokens
        const token = (0, tokenService_1.generateToken)(user.userid);
        const refreshToken = (0, tokenService_1.generateRefreshToken)(user.userid);
        // Incluir el token en el header de la respuesta
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({ message: "Inicio de sesión exitoso", refreshToken });
    }
    catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token requerido" });
        }
        // Verificar el refresh token
        const decoded = (0, tokenService_1.verifyRefreshToken)(refreshToken);
        if (!decoded) {
            return res.status(403).json({ error: "Refresh token inválido" });
        }
        // Generar un nuevo token
        const newToken = (0, tokenService_1.generateToken)(decoded.userId);
        res.status(200).json({ token: newToken });
    }
    catch (error) {
        console.error("Error al refrescar el token:", error);
        res.status(500).json({ error: "Error al refrescar el token" });
    }
});
exports.refreshToken = refreshToken;
