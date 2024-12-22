import mongoose, { Schema, Document } from 'mongoose';
import { IPowerSignRelationship, PowerSign } from '../types';

const PowerSignRelationshipSchema = new Schema({
  powerSign: { 
    type: String, 
    enum: Object.values(PowerSign),
    required: true,
    unique: true 
  },
  complementary: { 
    type: String, 
    enum: Object.values(PowerSign),
    required: true 
  },
  antagonists: [{ 
    type: String, 
    enum: Object.values(PowerSign) 
  }],
  energyGeneration: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  }
});

// Validate that a power sign can't be its own complementary
PowerSignRelationshipSchema.pre('save', function(next) {
  if (this.powerSign === this.complementary) {
    throw new Error('A power sign cannot be its own complementary');
  }
  if (this.antagonists.includes(this.powerSign)) {
    throw new Error('A power sign cannot be its own antagonist');
  }
  next();
});

export interface IPowerSignRelationshipDocument extends IPowerSignRelationship, Document {}
export const PowerSignRelationship = mongoose.model<IPowerSignRelationshipDocument>('PowerSignRelationship', PowerSignRelationshipSchema);
