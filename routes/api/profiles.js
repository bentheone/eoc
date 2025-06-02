import express from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg, .pdf, .doc and .docx files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);

    if (!profile) {
      return res.status(200).json({
        exists: false,
        msg: 'No profile found for this user',
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      });
    }

    res.json({ exists: true, ...profile.toObject() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/profiles/upload
// @desc    Upload document files
// @access  Private
router.post('/upload', protect, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    res.json({
      msg: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
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
      check('bio', 'Bio is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Creating profile with data:', JSON.stringify(req.body, null, 2));

      const profileFields = {
        user: req.user.id,
        bio: req.body.bio,
        location: req.body.location,
        website: req.body.website,
        phone: req.body.phone
      };

      // Handle personal information (for job seekers)
      if (req.body.personalInfo) {
        profileFields.personalInfo = {
          nationalId: req.body.personalInfo.nationalId,
          dateOfBirth: req.body.personalInfo.dateOfBirth,
          homeLocation: {
            province: req.body.personalInfo.homeLocation?.province,
            district: req.body.personalInfo.homeLocation?.district,
            sector: req.body.personalInfo.homeLocation?.sector,
            cell: req.body.personalInfo.homeLocation?.cell
          },
          gender: req.body.personalInfo.gender,
          maritalStatus: req.body.personalInfo.maritalStatus
        };
      }

      // Handle privacy consent
      if (req.body.privacyConsent) {
        profileFields.privacyConsent = {
          agreedToTerms: req.body.privacyConsent.agreedToTerms,
          agreedToPrivacyPolicy: req.body.privacyConsent.agreedToPrivacyPolicy,
          consentDate: req.body.privacyConsent.consentDate || new Date()
        };
      }

      // Handle profile completion status
      if (req.body.profileCompletion) {
        profileFields.profileCompletion = req.body.profileCompletion;
      }

      // Handle job seeker specific fields
      if (req.user.role === 'jobseeker' && req.body.jobSeeker) {
        profileFields.jobSeeker = {
          title: req.body.jobSeeker.title,
          skills: req.body.jobSeeker.skills,
          experience: req.body.jobSeeker.experience || [],
          education: req.body.jobSeeker.education || [],
          preferredJobTypes: req.body.jobSeeker.preferredJobTypes || [],
          preferredLocations: req.body.jobSeeker.preferredLocations || [],
          expectedSalary: req.body.jobSeeker.expectedSalary
        };

        // Handle latest education
        if (req.body.jobSeeker.latestEducation) {
          profileFields.jobSeeker.latestEducation = {
            level: req.body.jobSeeker.latestEducation.level,
            documentPath: req.body.jobSeeker.latestEducation.documentPath,
            verified: false
          };
        }

        // Handle latest work experience
        if (req.body.jobSeeker.latestWorkExperience) {
          profileFields.jobSeeker.latestWorkExperience = {
            company: req.body.jobSeeker.latestWorkExperience.company,
            yearsOfExperience: req.body.jobSeeker.latestWorkExperience.yearsOfExperience,
            documentPath: req.body.jobSeeker.latestWorkExperience.documentPath,
            verified: false
          };
        }
      }

      // Handle company specific fields
      if (req.user.role === 'company' && req.body.company) {
        profileFields.company = {
          name: req.body.company.name,
          tinNumber: req.body.company.tinNumber,
          registrationNumber: req.body.company.registrationNumber,
          industry: req.body.company.industry,
          size: req.body.company.size,
          founded: req.body.company.founded,
          headquarters: req.body.company.headquarters,
          description: req.body.company.description,
          branches: req.body.company.branches || [],
          hrNeeds: req.body.company.hrNeeds || {
            totalPositionsNeeded: 0,
            urgentPositions: 0,
            skillsNeeded: [],
            departmentNeeds: []
          },
          socialMedia: req.body.company.socialMedia || {}
        };
      }

      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).populate('user', ['name', 'email', 'role']);
      } else {
        // Create new profile
        profile = new Profile(profileFields);
        await profile.save();
        profile = await Profile.findById(profile.id).populate('user', ['name', 'email', 'role']);
      }

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
