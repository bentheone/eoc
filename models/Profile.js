import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Common fields for both job seekers and companies
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  phone: {
    type: String
  },
  // Personal identification (for job seekers)
  personalInfo: {
    nationalId: {
      type: String,
      match: [/^\d{16}$/, 'National ID must be 16 digits']
    },
    dateOfBirth: {
      type: Date
    },
    homeLocation: {
      province: String,
      district: String,
      sector: String,
      cell: String
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed']
    }
  },
  // Job seeker specific fields
  jobSeeker: {
    title: {
      type: String
    },
    skills: {
      type: [String]
    },
    experience: [
      {
        title: {
          type: String,
          required: true
        },
        company: {
          type: String,
          required: true
        },
        location: {
          type: String
        },
        from: {
          type: Date,
          required: true
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        },
        documentPath: {
          type: String // Path to employment letter/certificate
        },
        verified: {
          type: Boolean,
          default: false
        }
      }
    ],
    // Latest work experience (for quick reference)
    latestWorkExperience: {
      company: String,
      yearsOfExperience: {
        type: Number,
        min: 0
      },
      documentPath: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    education: [
      {
        school: {
          type: String,
          required: true
        },
        level: {
          type: String,
          enum: [
            'Primary Education (P1-P6)',
            'Lower Secondary (S1-S3)',
            'Upper Secondary (S4-S6)',
            'Technical and Vocational Education (TVET)',
            'Certificate',
            'Diploma',
            'Advanced Diploma',
            'Bachelor\'s Degree',
            'Master\'s Degree',
            'Doctorate (PhD)'
          ],
          required: true
        },
        fieldOfStudy: {
          type: String,
          required: true
        },
        from: {
          type: Date,
          required: true
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        },
        documentPath: {
          type: String // Path to uploaded certificate/diploma
        },
        verified: {
          type: Boolean,
          default: false
        }
      }
    ],
    // Latest education level (for quick reference)
    latestEducation: {
      level: {
        type: String,
        enum: [
          'Primary Education (P1-P6)',
          'Lower Secondary (S1-S3)',
          'Upper Secondary (S4-S6)',
          'Technical and Vocational Education (TVET)',
          'Certificate',
          'Diploma',
          'Advanced Diploma',
          'Bachelor\'s Degree',
          'Master\'s Degree',
          'Doctorate (PhD)'
        ]
      },
      documentPath: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    preferredJobTypes: {
      type: [String],
      enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']
    },
    preferredLocations: {
      type: [String]
    },
    expectedSalary: {
      type: Number
    }
  },
  // Company specific fields
  company: {
    // Stage 1: Company Identification
    name: {
      type: String
    },
    tinNumber: {
      type: String,
      match: [/^\d{9}$/, 'TIN Number must be 9 digits (Rwandan format)']
    },
    registrationNumber: {
      type: String
    },
    industry: {
      type: String
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    founded: {
      type: Number
    },
    headquarters: {
      province: String,
      district: String,
      sector: String,
      cell: String,
      address: String
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },

    // Stage 2: Branch Locations
    branches: [{
      name: String,
      location: {
        province: String,
        district: String,
        sector: String,
        cell: String,
        address: String
      },
      isHeadquarters: {
        type: Boolean,
        default: false
      },
      employeeCount: Number
    }],

    // Stage 3: Human Resources Needs
    hrNeeds: {
      totalPositionsNeeded: {
        type: Number,
        default: 0
      },
      urgentPositions: {
        type: Number,
        default: 0
      },
      skillsNeeded: [{
        skill: String,
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        },
        priority: {
          type: String,
          enum: ['Low', 'Medium', 'High', 'Critical']
        }
      }],
      departmentNeeds: [{
        department: String,
        positionsNeeded: Number,
        skills: [String],
        urgency: {
          type: String,
          enum: ['Low', 'Medium', 'High', 'Immediate']
        }
      }]
    },

    socialMedia: {
      linkedin: {
        type: String
      },
      twitter: {
        type: String
      },
      facebook: {
        type: String
      },
      website: {
        type: String
      }
    }
  },
  // Privacy and consent
  privacyConsent: {
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false
    },
    agreedToPrivacyPolicy: {
      type: Boolean,
      required: true,
      default: false
    },
    consentDate: {
      type: Date,
      default: Date.now
    }
  },
  // Profile completion status
  profileCompletion: {
    personalInfoCompleted: {
      type: Boolean,
      default: false
    },
    educationCompleted: {
      type: Boolean,
      default: false
    },
    experienceCompleted: {
      type: Boolean,
      default: false
    },
    consentCompleted: {
      type: Boolean,
      default: false
    },
    overallCompleted: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', ProfileSchema);
