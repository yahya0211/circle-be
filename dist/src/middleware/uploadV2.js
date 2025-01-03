"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("File type not supported"), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
}).fields([
    {
        name: "image",
        maxCount: 4,
    },
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "cover",
        maxCount: 1,
    },
]);
const uploadMiddleware = (fieldname) => {
    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        status: false,
                        message: "File too large",
                    });
                }
                return res.status(500).json({
                    status: false,
                    message: err.message,
                });
            }
            return next();
        });
    };
};
exports.default = uploadMiddleware;
