// // routes/files.js
// const express = require("express");
// const multer = require("multer");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const path = require("path");
// const File = require("../models/File");

// const router = express.Router();

// // Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "Access denied, no token provided" });

//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: "Invalid or expired token" });
//         req.user = user;
//         next();
//     });
// };

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath, { recursive: true });
//         }
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
// });

// // File filter to limit file types
// const fileFilter = (req, file, cb) => {
//     const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
//     if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type"), false);
//     }
// };

// // Multer upload configuration
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter,
// });

// // Route to handle file uploads
// router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//         res.status(200).json({ message: "File uploaded successfully", file: req.file.filename });
//     } catch (error) {
//         res.status(500).json({ message: "File upload failed", error: error.message });
//     }
// });

// // Route to list files
// router.get("/list", verifyToken, (req, res) => {
//     try {
//         const uploadPath = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadPath)) {
//             return res.status(200).json([]);
//         }
//         const files = fs.readdirSync(uploadPath).map(file => ({
//             name: file,
//             url: `/files/${file}`,
//         }));
//         res.status(200).json(files);
//     } catch (error) {
//         res.status(500).json({ message: "Unable to list files", error: error.message });
//     }
// });

// // Route to download a file
// router.get("/download/:filename", verifyToken, (req, res) => {
//     const { filename } = req.params;
//     const filePath = path.join(__dirname, "../uploads", filename);
//     if (!fs.existsSync(filePath)) {
//         return res.status(404).json({ message: "File not found" });
//     }
//     res.download(filePath, err => {
//         if (err) {
//             res.status(500).json({ message: "File download failed", error: err.message });
//         }
//     });
// });



// app.get('/files', async (req, res) => {
//     const files = await File.find({});
//     res.json(files);
// });

// app.post('/files/:id/increment-view', async (req, res) => {
//     const { id } = req.params;
//     await File.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
//     res.sendStatus(200);
// });

// app.get('/files/:id/shareable-link', (req, res) => {
//     const { id } = req.params;
//     const link = `${req.protocol}://${req.get('host')}/files/${id}`;
//     res.json({ link });
// });
// module.exports = router;


const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const File = require("../models/File");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Access denied, no token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    });
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "..", "uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// File filter to limit file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter,
});

const router = express.Router();

// Route to handle file uploads
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { tags } = req.body;

        const newFile = new File({
            filename: req.file.filename,
            filepath: req.file.path,
            tags: tags.split(','),
        });
        await newFile.save();

        res.status(200).json({ message: "File uploaded successfully", file: req.file.filename });
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
});

// Route to list files
router.get("/list", verifyToken, async (req, res) => {
    try {
        const files = await File.find({}).sort({ order: 1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: "Unable to list files", error: error.message });
    }
});

router.put('/reorder', verifyToken, async (req, res) => {
    console.log("Inside the /reorder")
    const { reorderedFiles } = req.body;

    if (!Array.isArray(reorderedFiles) || reorderedFiles.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of reordered files.' });
    }

    try {
        // Use bulkWrite for efficient updates
        const bulkOperations = reorderedFiles.map((file, index) => ({
            updateOne: {
                filter: { _id: file._id },
                update: { order: index },
            },
        }));

        await File.bulkWrite(bulkOperations);

        res.status(200).json({ message: 'File order updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update file order', details: error.message });
    }
});

// Route to download a file
router.get("/download/:filename", verifyToken, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
    }
    res.download(filePath, err => {
        if (err) {
            res.status(500).json({ message: "File download failed", error: err.message });
        }
    });
});

// Route to increment view count
router.post("/:id/increment-view", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await File.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Unable to increment view count", error: error.message });
    }
});

// Route to generate shareable link
router.get("/:id/shareable-link", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: "File not found" });

        const link = `${req.protocol}://${req.get("host")}/api/files/download/${file.name}`;
        res.json({ link });
    } catch (error) {
        res.status(500).json({ message: "Unable to generate shareable link", error: error.message });
    }
});

module.exports = router;
