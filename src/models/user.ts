import mongoose from "mongoose";
import { StudyPlan, Resource } from "@/types/user";

// Define the Resource schema
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: String,
  link: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the StudyPlan schema
const studyPlanSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  duration: String,
  examDate: Date,
  weeklyPlans: [{
    week: String,
    goals: [String],
    dailyTasks: [{
      day: String,
      tasks: [String],
      duration: String,
    }],
  }],
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the StudySession schema
const studySessionSchema = new mongoose.Schema({
  duration: Number,
  startTime: Date,
  endTime: Date,
  mode: String,
});

// Enhanced User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subjects: [{
    type: String,
    trim: true,
  }],
  savedPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan' }],
  savedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  profile: {
    avatar: String,
    bio: String,
    timezone: String,
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      studyReminders: {
        type: Boolean,
        default: true,
      },
    },
  },
  stats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyStats'
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Remove duplicate index declarations
userSchema.index({ 'savedPlans.subject': 1 });
userSchema.index({ subjects: 1 });

// Virtual for full name if needed
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to add a study plan
userSchema.methods.addStudyPlan = function(plan: StudyPlan) {
  this.savedPlans.push(plan);
  return this.save();
};

// Method to add a resource
userSchema.methods.addResource = function(resource: Resource) {
  this.savedResources.push(resource);
  return this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; 