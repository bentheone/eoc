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
        }
      }
    ],
    education: [
      {
        school: {
          type: String,
          required: true
        },
        degree: {
          type: String,
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
        }
      }
    ],
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
    name: {
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
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
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
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', ProfileSchema);
