"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Configuración de Morgan para registrar las solicitudes HTTP
app.use((0, morgan_1.default)('dev')); // Puedes cambiar 'dev' por otro formato como 'combined'
app.use('/auth', authRoutes_1.default);
// Rutas protegidas
app.use('/api', protectedRoutes_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
