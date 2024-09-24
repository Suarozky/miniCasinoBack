"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const games_1 = require("../controllers/games");
const router = express_1.default.Router();
// Ejemplo de ruta protegida
router.get("/profile", authMiddleware_1.authenticateToken, (req, res) => {
    // Aquí puedes acceder a req.user para obtener la información del usuario
    res.status(200).json({ message: "Acceso autorizado", user: req.user });
});
router.post('/api/generate-winner', authMiddleware_1.authenticateToken, games_1.generateWinner);
router.post('/api/race', authMiddleware_1.authenticateToken, games_1.simulateRace);
exports.default = router;
