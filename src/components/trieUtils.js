import Trie from './Trie'; // Adjust import based on the actual location of your Trie class
import jsonData from '../../resources/hindiWords.json'; // Import your JSON file

// Singleton instance of Trie
let trieInstance = null;

// Function to initialize the Trie with data
const initializeTrie = () => {
  if (!trieInstance) {
    trieInstance = new Trie();
    jsonData.words.forEach(item => trieInstance.insert(item));
  }
};

// Function to get suggestions from Trie
export const getSuggestionsFromTrie = (word) => {
  // Ensure Trie is initialized
  if (!trieInstance) {
    initializeTrie();
  }

  // Get suggestions
  return trieInstance.getSuggestions(word);
};
