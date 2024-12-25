# Historia Backend API

RESTful API service for the Historia Historical Events Visualization Platform, built with Node.js, Express, and MongoDB.

## Features

- **Event Management**
  - Coordinate-based event queries
  - Year range filtering
  - Category-based filtering
  - Advanced search capabilities

- **Data Processing**
  - Custom event categorization system
  - Natural Language Processing for event classification
  - Geospatial data handling
  - Efficient data pagination

## Technical Stack

- **Core Technologies**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose ODM

- **Features**
  - RESTful API architecture
  - Geospatial queries
  - Advanced filtering
  - Pagination support

## API Endpoints

### Events

```bash
GET /api/events/coordinates
GET /api/events/search/:keyword
GET /api/events/category/:category
GET /api/events/yearrange
GET /api/events/paginate
