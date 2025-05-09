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
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prismaClient_1.default.todo.findMany();
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});
exports.getTodos = getTodos;
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, author } = req.body;
        // Ensure we get all necessary fields in the request
        if (!title || !description || !author) {
            res.status(400).json({ error: 'Missing required fields' });
        }
        const todo = yield prismaClient_1.default.todo.create({
            data: {
                title,
                description,
                author,
            },
        });
        res.status(201).json(todo);
    }
    catch (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Failed to create todo', details: err.message });
    }
});
exports.createTodo = createTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, author } = req.body;
        const updatedTodo = yield prismaClient_1.default.todo.update({
            where: { id: parseInt(id, 10) },
            data: { title, description, author },
        });
        res.json(updatedTodo);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prismaClient_1.default.todo.delete({
            where: { id: parseInt(id, 10) },
        });
        res.json({ message: "Todo deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete todo" });
    }
});
exports.deleteTodo = deleteTodo;
