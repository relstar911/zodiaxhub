import express from 'express';
import { PowerSignRelationship } from '../models/PowerSignRelationship';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Get all power sign relationships
router.get('/', async (req, res, next) => {
  try {
    const relationships = await PowerSignRelationship.find();
    res.json(relationships);
  } catch (error) {
    next(error);
  }
});

// Get specific power sign relationship
router.get('/:powerSign', async (req, res, next) => {
  try {
    const relationship = await PowerSignRelationship.findOne({ 
      powerSign: req.params.powerSign 
    });
    if (!relationship) {
      return res.status(404).json({ 
        message: 'Power sign relationship not found' 
      });
    }
    res.json(relationship);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.use(protect);
router.use(authorize('admin'));

// Create power sign relationship
router.post('/', async (req, res, next) => {
  try {
    const relationship = await PowerSignRelationship.create(req.body);
    res.status(201).json(relationship);
  } catch (error) {
    next(error);
  }
});

// Update power sign relationship
router.put('/:powerSign', async (req, res, next) => {
  try {
    const relationship = await PowerSignRelationship.findOneAndUpdate(
      { powerSign: req.params.powerSign },
      req.body,
      { new: true, runValidators: true }
    );
    if (!relationship) {
      return res.status(404).json({ 
        message: 'Power sign relationship not found' 
      });
    }
    res.json(relationship);
  } catch (error) {
    next(error);
  }
});

// Delete power sign relationship
router.delete('/:powerSign', async (req, res, next) => {
  try {
    const relationship = await PowerSignRelationship.findOneAndDelete({
      powerSign: req.params.powerSign
    });
    if (!relationship) {
      return res.status(404).json({ 
        message: 'Power sign relationship not found' 
      });
    }
    res.json({ message: 'Power sign relationship deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
