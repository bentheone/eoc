import express from 'express';
import { check, validationResult } from 'express-validator';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('bio', 'Bio is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bio,
      location,
      website,
      phone,
      // Job seeker fields
      title,
      skills,
      experience,
      education,
      preferredJobTypes,
      preferredLocations,
      expectedSalary,
      // Company fields
      name,
      industry,
      size,
      founded,
      description,
      socialMedia
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      bio,
      location,
      website: website && website !== '' ? website : undefined,
      phone: phone && phone !== '' ? phone : undefined
    };

    // Build job seeker or company object based on user role
    if (req.user.role === 'jobseeker') {
      profileFields.jobSeeker = {};
      if (title) profileFields.jobSeeker.title = title;
      if (skills) profileFields.jobSeeker.skills = skills.split(',').map(skill => skill.trim());
      if (experience) profileFields.jobSeeker.experience = experience;
      if (education) profileFields.jobSeeker.education = education;
      if (preferredJobTypes) profileFields.jobSeeker.preferredJobTypes = preferredJobTypes;
      if (preferredLocations) profileFields.jobSeeker.preferredLocations = preferredLocations.split(',').map(location => location.trim());
      if (expectedSalary) profileFields.jobSeeker.expectedSalary = expectedSalary;
    } else if (req.user.role === 'company') {
      profileFields.company = {};
      if (name) profileFields.company.name = name;
      if (industry) profileFields.company.industry = industry;
      if (size) profileFields.company.size = size;
      if (founded) profileFields.company.founded = founded;
      if (description) profileFields.company.description = description;
      if (socialMedia) profileFields.company.socialMedia = socialMedia;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/profiles
// @desc    Get all profiles
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email', 'role']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get('/user/:user_id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'email', 'role']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/profiles
// @desc    Delete profile and user
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
