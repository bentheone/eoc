import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Please add job requirements'],
    maxlength: [1000, 'Requirements cannot be more than 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a job location']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
    required: true
  },
  salary: {
    type: Number
  },
  skills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  experience: {
    type: String,
    enum: ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Executive'],
    required: true
  },
  education: {
    type: String,
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'None'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'closed'],
    default: 'pending'
  },
  applicationDeadline: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', JobSchema);
