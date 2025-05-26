import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['resume', 'cv', 'cover_letter', 'certificate', 'other'],
    required: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add a file URL']
  },
  fileKey: {
    type: String,
    required: [true, 'Please add a file key']
  },
  fileSize: {
    type: Number,
    required: [true, 'Please add a file size']
  },
  fileType: {
    type: String,
    required: [true, 'Please add a file type']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Document', DocumentSchema);
