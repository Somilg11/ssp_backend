"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dspController_1 = require("../controllers/dspController");
const router = express_1.default.Router();
router.get('/', dspController_1.getDSPs);
router.post('/', dspController_1.createDSP);
exports.default = router;
