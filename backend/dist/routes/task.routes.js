"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .post(auth_middleware_1.protect, task_controller_1.createTask)
    .get(task_controller_1.getTasks);
router.route('/:id')
    .get(task_controller_1.getTaskById)
    .put(auth_middleware_1.protect, task_controller_1.updateTask);
exports.default = router;
