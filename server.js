const express = require("express");
const Event = require("../models/Event");
const router = express.Router();


// category events
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params; // e.g., "births"
    console.log(req.params);

    const events = await Event.find({ category });
    res.json(events);
    console.log(`Category api hit for category: ${req.params.category}`);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events by category" });
  }
});

// keyword search
router.get("/search/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const events = await Event.find({
      title: { $regex: keyword, $options: "i" },
    });
    console.log(`Searching events with keyword: ${keyword}`);
    res.json(events);
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ error: "Error searching events" });
  }
});

// paginated (best)
router.get("/paginate", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, date, year } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (date) filters.date = date; // Format: "MM/DD"
    if (year) filters.year = parseInt(year);

    const skip = (page - 1) * limit;
    const events = await Event.find(filters).skip(skip).limit(parseInt(limit));
    const totalEvents = await Event.countDocuments(filters);

    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      events,
    });
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    res.status(500).json({ error: "Error fetching paginated events" });
  }
});

//events with coordinates 

// Enhanced events with coordinates endpoint
router.get('/coordinates', async (req, res) => {
  try {
    // Destructure query parameters
    const { page = 1, limit = 100, startYear, endYear, category } = req.query;

    // Pagination logic
    const skip = (page - 1) * limit;
    const query = { coordinates: { $ne: null } };

    // Add year range filtering if provided
    if (startYear && endYear) {
      query.year = { $gte: Number(startYear), $lte: Number(endYear) };
    }

    // Add category filtering if a valid category is provided
    const validCategories = ['selected', 'births', 'deaths', 'events', 'holidays'];
    if (category && validCategories.includes(category.toLowerCase())) {
      query.category = category.toLowerCase();
    }

    // Fetch filtered events with pagination
    const events = await Event.find(query).skip(skip).limit(Number(limit));
    const totalEvents = await Event.countDocuments(query); // For total pages calculation

    // Response with pagination metadata
    res.json({
      events,
      currentPage: Number(page),
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error) {
    console.error('Error fetching events with coordinates:', error);
    res.status(500).json({ error: 'Error fetching events with coordinates' });
  }
});



// SIGLE EVENT FETCH FOR CARD

router.get('/id/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ error: 'Error fetching event by ID' });
  }
});

// Year range query

router.get('/yearrange', async (req, res) => {
  try {
    const { startYear, endYear, page = 1, limit = 10 } = req.query;
    if (!startYear || !endYear) {
      return res.status(400).json({ error: 'Start year and end year are required' });
    }
    const skip = (page - 1) * limit;
    const filters = {
      year: { $gte: parseInt(startYear), $lte: parseInt(endYear) },
    };

    const events = await Event.find(filters).skip(skip).limit(parseInt(limit));
    const totalEvents = await Event.countDocuments(filters);
    res.json({
      page: parseInt(page),
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      events,
    });
  } catch (error) {
    console.error('Error fetching events by year range:', error);
    res.status(500).json({ error: 'Error fetching events by year range' });
  }
});


module.exports = router;
