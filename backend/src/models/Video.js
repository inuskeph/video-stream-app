const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  category: { type: String, enum: ['Entertainment','Education','Music','Sports','Gaming','News','Technology','Comedy','Lifestyle','Other'], default: 'Other' },
  tags: [{ type: String }],
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: { type: String, maxlength: 500 }, createdAt: { type: Date, default: Date.now } }],
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
module.exports = mongoose.model('Video', videoSchema);
