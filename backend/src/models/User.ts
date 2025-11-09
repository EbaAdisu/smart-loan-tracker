// User Profile Model (extends Better Auth user)
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string; // References Better Auth user.id
  profilePicture?: string;
  deviceTokens: string[]; // For push notifications
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  addDeviceToken(token: string): void;
  removeDeviceToken(token: string): void;
  updateLastLogin(): void;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    deviceTokens: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'userProfiles',
  }
);

// Indexes
UserProfileSchema.index({ userId: 1 });
UserProfileSchema.index({ createdAt: -1 });

// Methods
UserProfileSchema.methods.addDeviceToken = function(token: string) {
  if (!this.deviceTokens.includes(token)) {
    this.deviceTokens.push(token);
  }
};

UserProfileSchema.methods.removeDeviceToken = function(token: string) {
  this.deviceTokens = this.deviceTokens.filter((t: string) => t !== token);
};

UserProfileSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
};

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
export default UserProfile;

