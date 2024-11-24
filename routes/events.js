const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// Fetch events by date and category (Specific route should come first)
router.get('/date/:month/:day/category/:category', async (req, res) => {
  try {
    const { month, day, category } = req.params;  // e.g., "01/01", "births"
    const formattedDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}`
    const events = await Event.find({ date:formattedDate, category });
    console.log(`Date api hit for date: ${formattedDate} and category: ${category}`);

    
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events by date and category' });
  }
});

// Fetch events by category (General route for category)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;  // e.g., "births"
    console.log(req.params);
    
    const events = await Event.find({ category });
    res.json(events);
    console.log(`Category api hit for category: ${req.params.category}`);
    
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events by category' });
  }
});

// Fetch events by date (General route for date)
router.get('/date/:month/:day', async (req, res) => {
  try {
    const { month, day } = req.params;  // e.g., "01/01"
    const formattedDate = `${month.padStart(2, '0')}/${day.padStart(2, '0')}`
    console.log(`Date: ${formattedDate}`);
    console.log(req.params);
    const events = await Event.find({ date : formattedDate });
    res.json(events);
    console.log(`Date api hit for date: ${formattedDate}`);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events by date' });
  }
});

router.get('/year/:year', async (req, res) => {
  try {
    const { year } = req.params;  // e.g., "01/01"
    console.log(req.params);
    
    const events = await Event.find({ year });
    res.json(events);
    console.log(`Year api hit for year: ${req.params.year}`);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events by year' });
  }
});

router.get('/catyear/:year.:category', async (req, res) => {
  try {
    const { categorised_year } = req.params;  // e.g., "01/01"
    console.log(req.params);
    
    const events = await Event.find(req.params );
    res.json(events);
    console.log(`Year api hit for year: ${req.params.year} and category: ${req.params.category}`);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events by year' });
  }
});

// Fetch all events
router.get('/', async (req, res) => {
  try {
    // Fetch all events from the 'events' collection
    const events = await Event.find();  // Mongoose query to fetch all events
    res.status(200).json(events);       // Send the data back to the client in JSON format
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });  // Error handling
  }
});

router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const events = await Event.find({ title: { $regex: keyword, $options: 'i' } });
    console.log(`Searching events with keyword: ${keyword}`);
    res.json(events);
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ error: 'Error searching events' });
  }
});
router.get('/paginate', async (req, res) => {
  try {
    const { page = 2, limit = 1491 } = req.query; // Default: page 1, 10 items per page
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(parseInt(limit));
    const totalEvents = await Event.countDocuments();
    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      events,
    });
  } catch (error) {
    console.error('Error fetching paginated events:', error);
    res.status(500).json({ error: 'Error fetching paginated events' });
  }
});


router.get('/categories', async (req, res) => {
  try {
    const categories = await Event.distinct('category');
    console.log('Fetching all unique categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

router.get('/yearrange', async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    if (!startYear || !endYear) {
      return res.status(400).json({ error: 'Start year and end year are required' });
    }
    const events = await Event.find({
      year: { $gte: parseInt(startYear), $lte: parseInt(endYear) },
    });
    console.log(`Fetching events between years: ${startYear} and ${endYear}`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by year range:', error);
    res.status(500).json({ error: 'Error fetching events by year range' });
  }
});


module.exports = router;