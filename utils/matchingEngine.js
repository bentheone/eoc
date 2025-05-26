import Job from '../models/Job.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Match from '../models/Match.js';

/**
 * Calculate the similarity score between two arrays of strings
 * @param {Array} arr1 - First array of strings
 * @param {Array} arr2 - Second array of strings
 * @returns {Number} - Similarity score between 0 and 100
 */
const calculateSimilarity = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) {
    return 0;
  }

  // Convert arrays to lowercase for case-insensitive comparison
  const set1 = new Set(arr1.map(item => item.toLowerCase()));
  const set2 = new Set(arr2.map(item => item.toLowerCase()));

  // Find intersection
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  
  // Calculate Jaccard similarity coefficient
  const union = new Set([...set1, ...set2]);
  const similarity = (intersection.size / union.size) * 100;
  
  return Math.round(similarity);
};

/**
 * Calculate the match score between a job and a job seeker
 * @param {Object} job - Job document
 * @param {Object} jobSeekerProfile - Job seeker profile document
 * @returns {Object} - Match score and details
 */
const calculateMatchScore = (job, jobSeekerProfile) => {
  // Calculate skills match
  const skillsMatch = calculateSimilarity(job.skills, jobSeekerProfile.jobSeeker.skills || []);
  
  // Calculate experience match
  let experienceMatch = 0;
  const experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive'];
  const jobExperienceIndex = experienceLevels.indexOf(job.experience);
  
  // Check if job seeker has relevant experience
  if (jobSeekerProfile.jobSeeker.experience && jobSeekerProfile.jobSeeker.experience.length > 0) {
    // Calculate years of experience
    const totalExperience = jobSeekerProfile.jobSeeker.experience.reduce((total, exp) => {
      const from = new Date(exp.from);
      const to = exp.current ? new Date() : new Date(exp.to);
      const years = (to - from) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);
    
    // Map years of experience to experience level
    let jobSeekerExperienceIndex;
    if (totalExperience < 1) {
      jobSeekerExperienceIndex = 0; // Entry Level
    } else if (totalExperience < 3) {
      jobSeekerExperienceIndex = 1; // Junior
    } else if (totalExperience < 5) {
      jobSeekerExperienceIndex = 2; // Mid-Level
    } else if (totalExperience < 10) {
      jobSeekerExperienceIndex = 3; // Senior
    } else {
      jobSeekerExperienceIndex = 4; // Executive
    }
    
    // Calculate experience match based on difference in experience levels
    const diff = Math.abs(jobExperienceIndex - jobSeekerExperienceIndex);
    if (diff === 0) {
      experienceMatch = 100;
    } else if (diff === 1) {
      experienceMatch = 75;
    } else if (diff === 2) {
      experienceMatch = 50;
    } else if (diff === 3) {
      experienceMatch = 25;
    } else {
      experienceMatch = 0;
    }
  }
  
  // Calculate education match
  let educationMatch = 0;
  const educationLevels = ['None', 'High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'];
  const jobEducationIndex = educationLevels.indexOf(job.education);
  
  // Check if job seeker has education
  if (jobSeekerProfile.jobSeeker.education && jobSeekerProfile.jobSeeker.education.length > 0) {
    // Find highest education level
    const degrees = jobSeekerProfile.jobSeeker.education.map(edu => edu.degree);
    let highestEducationIndex = 0;
    
    for (const degree of degrees) {
      let index = 0;
      if (degree.toLowerCase().includes('high school')) {
        index = 1;
      } else if (degree.toLowerCase().includes('associate')) {
        index = 2;
      } else if (degree.toLowerCase().includes('bachelor')) {
        index = 3;
      } else if (degree.toLowerCase().includes('master')) {
        index = 4;
      } else if (degree.toLowerCase().includes('doctorate') || degree.toLowerCase().includes('phd')) {
        index = 5;
      }
      
      if (index > highestEducationIndex) {
        highestEducationIndex = index;
      }
    }
    
    // Calculate education match
    if (highestEducationIndex >= jobEducationIndex) {
      educationMatch = 100;
    } else {
      educationMatch = (highestEducationIndex / jobEducationIndex) * 100;
    }
  }
  
  // Calculate location match
  let locationMatch = 0;
  if (jobSeekerProfile.jobSeeker.preferredLocations && jobSeekerProfile.jobSeeker.preferredLocations.length > 0) {
    // Check if job location matches any preferred location
    const jobLocation = job.location.toLowerCase();
    const preferredLocations = jobSeekerProfile.jobSeeker.preferredLocations.map(loc => loc.toLowerCase());
    
    for (const location of preferredLocations) {
      if (jobLocation.includes(location) || location.includes(jobLocation)) {
        locationMatch = 100;
        break;
      }
    }
  } else if (jobSeekerProfile.location) {
    // Compare job location with profile location
    const jobLocation = job.location.toLowerCase();
    const profileLocation = jobSeekerProfile.location.toLowerCase();
    
    if (jobLocation.includes(profileLocation) || profileLocation.includes(jobLocation)) {
      locationMatch = 100;
    }
  }
  
  // Calculate overall match score
  const weights = {
    skills: 0.4,
    experience: 0.3,
    education: 0.2,
    location: 0.1
  };
  
  const overallScore = Math.round(
    skillsMatch * weights.skills +
    experienceMatch * weights.experience +
    educationMatch * weights.education +
    locationMatch * weights.location
  );
  
  return {
    matchScore: overallScore,
    matchDetails: {
      skillsMatch,
      experienceMatch,
      educationMatch,
      locationMatch
    }
  };
};

/**
 * Generate matches between jobs and job seekers
 * @returns {Object} - Result of match generation
 */
export const generateMatches = async () => {
  try {
    // Get all approved and active jobs
    const jobs = await Job.find({ status: 'approved', isActive: true });
    
    // Get all verified and active job seekers
    const jobSeekers = await User.find({ role: 'jobseeker', isVerified: true, isActive: true });
    
    let matchesCreated = 0;
    let matchesUpdated = 0;
    
    // Process each job
    for (const job of jobs) {
      const company = await User.findById(job.company);
      
      // Skip if company is not verified or active
      if (!company || !company.isVerified || !company.isActive) {
        continue;
      }
      
      // Process each job seeker
      for (const jobSeeker of jobSeekers) {
        // Get job seeker profile
        const jobSeekerProfile = await Profile.findOne({ user: jobSeeker._id });
        
        // Skip if profile doesn't exist or doesn't have job seeker data
        if (!jobSeekerProfile || !jobSeekerProfile.jobSeeker) {
          continue;
        }
        
        // Calculate match score
        const { matchScore, matchDetails } = calculateMatchScore(job, jobSeekerProfile);
        
        // Only create matches with score above threshold (e.g., 50)
        if (matchScore >= 50) {
          // Check if match already exists
          const existingMatch = await Match.findOne({
            job: job._id,
            jobSeeker: jobSeeker._id,
            company: company._id
          });
          
          if (existingMatch) {
            // Update existing match
            existingMatch.matchScore = matchScore;
            existingMatch.matchDetails = matchDetails;
            await existingMatch.save();
            matchesUpdated++;
          } else {
            // Create new match
            const newMatch = new Match({
              job: job._id,
              jobSeeker: jobSeeker._id,
              company: company._id,
              matchScore,
              matchDetails,
              status: 'pending',
              adminApproved: false
            });
            
            await newMatch.save();
            matchesCreated++;
          }
        }
      }
    }
    
    return {
      success: true,
      matchesCreated,
      matchesUpdated,
      total: matchesCreated + matchesUpdated
    };
  } catch (err) {
    console.error('Error generating matches:', err);
    throw err;
  }
};
