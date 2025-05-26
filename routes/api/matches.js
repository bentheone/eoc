import express from 'express';
import { check, validationResult } from 'express-validator';
import Match from '../../models/Match.js';
import Job from '../../models/Job.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import { protect, authorize } from '../../middleware/auth.js';
import { generateMatches } from '../../utils/matchingEngine.js';

const router = express.Router();

// @route   POST api/matches/generate
// @desc    Generate matches for all jobs and job seekers
// @access  Private/Admin
router.post('/generate', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await generateMatches();
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/matches/admin
// @desc    Get all matches for admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('job', ['title', 'company'])
      .populate('jobSeeker', ['name', 'email'])
      .populate('company', ['name', 'email'])
      .sort({ matchScore: -1 });
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/matches/jobseeker
// @desc    Get all matches for a job seeker
// @access  Private/JobSeeker
router.get('/jobseeker', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const matches = await Match.find({ 
      jobSeeker: req.user.id,
      adminApproved: true // Only show admin-approved matches
    })
      .populate('job', ['title', 'company', 'location', 'jobType', 'salary'])
      .populate('company', ['name'])
      .sort({ matchScore: -1 });
    
    // Mark matches as viewed by job seeker
    for (const match of matches) {
      if (!match.jobSeekerViewed) {
        match.jobSeekerViewed = true;
        await match.save();
      }
    }
    
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/matches/company
// @desc    Get all matches for a company
// @access  Private/Company
router.get('/company', protect, authorize('company'), async (req, res) => {
  try {
    const matches = await Match.find({ 
      company: req.user.id,
      adminApproved: true // Only show admin-approved matches
    })
      .populate('job', ['title', 'location', 'jobType'])
      .populate('jobSeeker', ['name'])
      .sort({ matchScore: -1 });
    
    // Mark matches as viewed by company
    for (const match of matches) {
      if (!match.companyViewed) {
        match.companyViewed = true;
        await match.save();
      }
    }
    
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/matches/:id
// @desc    Get match by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('job', ['title', 'description', 'requirements', 'location', 'jobType', 'salary', 'skills', 'experience', 'education'])
      .populate('jobSeeker', ['name', 'email'])
      .populate('company', ['name', 'email']);

    if (!match) {
      return res.status(404).json({ msg: 'Match not found' });
    }

    // Check if user is authorized to view this match
    if (
      match.jobSeeker.toString() !== req.user.id &&
      match.company.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if match is admin approved for non-admin users
    if (!match.adminApproved && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Match not yet approved by admin' });
    }

    // Update viewed status
    if (match.jobSeeker.toString() === req.user.id && !match.jobSeekerViewed) {
      match.jobSeekerViewed = true;
      await match.save();
    } else if (match.company.toString() === req.user.id && !match.companyViewed) {
      match.companyViewed = true;
      await match.save();
    }

    res.json(match);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Match not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/matches/:id/admin-approval
// @desc    Update match admin approval status
// @access  Private/Admin
router.put(
  '/:id/admin-approval',
  [
    protect,
    authorize('admin'),
    [
      check('adminApproved', 'Admin approval status is required').isBoolean(),
      check('adminNotes', 'Admin notes are required when rejecting').custom((value, { req }) => {
        if (req.body.adminApproved === false && !value) {
          throw new Error('Admin notes are required when rejecting a match');
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
      const match = await Match.findById(req.params.id);

      if (!match) {
        return res.status(404).json({ msg: 'Match not found' });
      }

      match.adminApproved = req.body.adminApproved;
      match.adminNotes = req.body.adminNotes;
      
      await match.save();

      res.json(match);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Match not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/matches/:id/status
// @desc    Update match status
// @access  Private
router.put(
  '/:id/status',
  [
    protect,
    [
      check('status', 'Status is required').isIn(['pending', 'approved', 'rejected', 'applied', 'interviewed', 'offered', 'hired', 'closed'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const match = await Match.findById(req.params.id);

      if (!match) {
        return res.status(404).json({ msg: 'Match not found' });
      }

      // Check if user is authorized to update this match
      if (
        match.jobSeeker.toString() !== req.user.id &&
        match.company.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // Check if match is admin approved
      if (!match.adminApproved) {
        return res.status(401).json({ msg: 'Match not yet approved by admin' });
      }

      // Validate status transitions based on user role
      const { status } = req.body;
      
      if (req.user.role === 'jobseeker') {
        // Job seekers can only apply or reject
        if (status !== 'applied' && status !== 'rejected') {
          return res.status(400).json({ msg: 'Invalid status transition for job seeker' });
        }
      } else if (req.user.role === 'company') {
        // Companies can update to interviewed, offered, hired, or rejected
        if (match.status !== 'applied' && (status === 'interviewed' || status === 'rejected')) {
          return res.status(400).json({ msg: 'Job seeker must apply first' });
        }
        
        if (match.status !== 'interviewed' && (status === 'offered' || status === 'rejected')) {
          return res.status(400).json({ msg: 'Job seeker must be interviewed first' });
        }
        
        if (match.status !== 'offered' && (status === 'hired' || status === 'rejected')) {
          return res.status(400).json({ msg: 'Job seeker must be offered first' });
        }
      }

      match.status = status;
      await match.save();

      res.json(match);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Match not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

export default router;
