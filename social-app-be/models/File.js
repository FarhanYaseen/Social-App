// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema({
//     name: String,
//     size: Number,
//     mimeType: String,
//     uploadDate: Date,
//     previewLink: String,
//     shareableLink: String,
//     viewCount: { type: Number, default: 0 },
// });

// module.exports = mongoose.model("File", fileSchema);


// models/File.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    tags: [String],
    views: { type: Number, default: 0 },
    shareToken: { type: String },
    // Remove the default order field
}, { timestamps: true }); // Optional: add timestamps if you want createdAt and updatedAt

// Apply the auto-increment plugin to the order field
FileSchema.plugin(AutoIncrement, {
    inc_field: 'order', // Use inc_field instead of order
    start_seq: 0 // Optional: specify starting sequence number
});

module.exports = mongoose.model('File', FileSchema);
