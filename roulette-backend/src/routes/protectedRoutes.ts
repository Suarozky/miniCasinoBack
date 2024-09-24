import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {generateWinner,simulateRace} from "../controllers/games";

const router = express.Router();

// Ejemplo de ruta protegida
router.get("/profile", authenticateToken, (req, res) => {
  // Aquí puedes acceder a req.user para obtener la información del usuario
  res.status(200).json({ message: "Acceso autorizado", user: req.user });
});

router.post('/api/generate-winner', authenticateToken, generateWinner);
router.post('/api/race', authenticateToken, simulateRace);





export default router;
