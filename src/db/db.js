// src/db/db.js
import Dexie from 'dexie';

// Create a new Dexie instance
const db = new Dexie('UserStoriesDB');

// Define a version and stores
db.version(1).stores({
  stories: '++id, title, content, updatedAt' // auto-increment id and some fields
});

export default db;