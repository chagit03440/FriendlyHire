import multer from "multer";

// Set up multer storage and file filter
const storage = multer.memoryStorage(); // Store files in memory (for easy uploading to cloud storage)
const upload = multer({ storage: storage });

export const uploadFile = upload.single("file"); // This handles a single file with the field name 'file'
