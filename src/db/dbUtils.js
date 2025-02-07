// src/db/dbUtils.js
import db from './db';

export const exportStories = async () => {
  const stories = await db.stories.toArray();
  return JSON.stringify(stories, null, 2);
};

export const importStories = async (jsonString) => {
  try {
    const stories = JSON.parse(jsonString);
    // Clear the current stories and bulk add the imported ones.
    await db.stories.clear();
    await db.stories.bulkAdd(stories);
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};
