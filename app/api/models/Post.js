import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [CommentSchema], 
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }, 
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
