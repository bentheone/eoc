import express from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../../models/Document.js';
import { protect, authorize } from '../../middleware/auth.js';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only PDF and DOCX files
  const filetypes = /pdf|docx|doc/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF and DOCX files are allowed'));
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

const router = express.Router();

// @route   POST api/documents
// @desc    Upload a document
// @access  Private/JobSeeker
router.post(
  '/',
  [
    protect,
    authorize('jobseeker'),
    upload.single('file'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['resume', 'cv', 'cover_letter', 'certificate', 'other'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'Please upload a file' });
      }

      const { name, type, isDefault } = req.body;

      // Create document
      const document = new Document({
        user: req.user.id,
        name,
        type,
        fileUrl: `/uploads/${req.file.filename}`,
        fileKey: req.file.filename,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        isDefault: isDefault === 'true'
      });

      // If this document is set as default, unset any other default documents of the same type
      if (isDefault === 'true') {
        await Document.updateMany(
          { user: req.user.id, type, isDefault: true },
          { isDefault: false }
        );
      }

      await document.save();

      res.json(document);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/documents
// @desc    Get all documents for current user
// @access  Private/JobSeeker
router.get('/', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/documents/admin
// @desc    Get all documents for admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('user', ['name', 'email'])
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/documents/:id
// @desc    Get document by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check if user is authorized to view this document
    if (
      document.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/documents/:id/status
// @desc    Update document status (admin only)
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    protect,
    authorize('admin'),
    [
      check('status', 'Status is required').isIn(['pending', 'approved', 'rejected']),
      check('adminNotes', 'Admin notes are required when rejecting').custom((value, { req }) => {
        if (req.body.status === 'rejected' && !value) {
          throw new Error('Admin notes are required when rejecting a document');
        }
        return true;
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ msg: 'Document not found' });
      }

      document.status = req.body.status;
      document.adminNotes = req.body.adminNotes;
      
      await document.save();

      res.json(document);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Document not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check if user is authorized to delete this document
    if (
      document.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete file from storage
    const filePath = path.join(process.cwd(), document.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();

    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;
