import express from 'express';
import { check, validationResult } from 'express-validator';
import Job from '../../models/Job.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// @route   POST api/jobs
// @desc    Create a job
// @access  Private/Company
router.post(
  '/',
  [
    protect,
    authorize('company'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('requirements', 'Requirements are required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('jobType', 'Job type is required').isIn(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']),
      check('skills', 'Skills are required').not().isEmpty(),
      check('experience', 'Experience level is required').isIn(['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive']),
      check('education', 'Education level is required').isIn(['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'None'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        title,
        description,
        requirements,
        location,
        jobType,
        salary,
        skills,
        experience,
        education,
        applicationDeadline
      } = req.body;

      // Create job object
      const jobFields = {
        company: req.user.id,
        title,
        description,
        requirements,
        location,
        jobType,
        experience,
        education,
        status: 'pending' // All jobs need admin approval
      };

      if (salary) jobFields.salary = salary;
      if (skills) {
        jobFields.skills = skills.split(',').map(skill => skill.trim());
      }
      if (applicationDeadline) jobFields.applicationDeadline = applicationDeadline;

      const job = new Job(jobFields);
      await job.save();

      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved', isActive: true })
      .populate('company', ['name'])
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs/admin
// @desc    Get all jobs for admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', ['name', 'email'])
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs/company
// @desc    Get all jobs for a company
// @access  Private/Company
router.get('/company', protect, authorize('company'), async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', ['name']);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Only return approved jobs to the public
    if (job.status !== 'approved' && !req.user) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private/Company
router.put(
  '/:id',
  [
    protect,
    authorize('company'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('requirements', 'Requirements are required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('jobType', 'Job type is required').isIn(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']),
      check('skills', 'Skills are required').not().isEmpty(),
      check('experience', 'Experience level is required').isIn(['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive']),
      check('education', 'Education level is required').isIn(['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'None'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }

      // Check if job belongs to user
      if (job.company.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const {
        title,
        description,
        requirements,
        location,
        jobType,
        salary,
        skills,
        experience,
        education,
        applicationDeadline
      } = req.body;

      // Update job fields
      job.title = title;
      job.description = description;
      job.requirements = requirements;
      job.location = location;
      job.jobType = jobType;
      job.experience = experience;
      job.education = education;
      job.status = 'pending'; // Reset to pending for admin approval

      if (salary) job.salary = salary;
      if (skills) {
        job.skills = skills.split(',').map(skill => skill.trim());
      }
      if (applicationDeadline) job.applicationDeadline = applicationDeadline;

      await job.save();

      res.json(job);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Job not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/jobs/:id/status
// @desc    Update job status (admin only)
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    protect,
    authorize('admin'),
    [
      check('status', 'Status is required').isIn(['pending', 'approved', 'rejected', 'closed'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }

      job.status = req.body.status;
      await job.save();

      res.json(job);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Job not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private/Company or Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if job belongs to user or user is admin
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await job.deleteOne();

    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;
