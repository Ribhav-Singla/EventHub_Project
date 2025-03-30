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
const express_1 = __importDefault(require("express"));
const v1_1 = require("./routes/v1");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)(corsOptions));
const server = (0, http_1.createServer)(app);
(0, socket_1.default)(server);
app.use(express_1.default.json());
app.use(express_1.default.static('uploads/'));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Server is running');
}));
app.use('/api/v1', v1_1.router);
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
