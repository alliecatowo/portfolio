/**
 * Simple composable for accessing Directus data
 */
export function useDirectusData() {
  const { $directus, $readItems, $readItem, $readSingleton } = useNuxtApp();
  
  /**
   * Fetch items from a collection
   */
  async function getItems(collection, options = {}) {
    try {
      return await $directus.request($readItems(collection, options));
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      return [];
    }
  }
  
  /**
   * Fetch a single item by ID
   */
  async function getItem(collection, id, options = {}) {
    try {
      return await $directus.request($readItem(collection, id, options));
    } catch (error) {
      console.error(`Error fetching ${collection}/${id}:`, error);
      return null;
    }
  }
  
  /**
   * Fetch a singleton
   */
  async function getSingleton(collection, options = {}) {
    try {
      return await $directus.request($readSingleton(collection, options));
    } catch (error) {
      console.error(`Error fetching singleton ${collection}:`, error);
      return null;
    }
  }
  
  return {
    getItems,
    getItem,
    getSingleton
  };
} 