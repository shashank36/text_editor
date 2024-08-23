// Trie.js
class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(word) {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    getSuggestions(word) {
      const suggestions = [];
      const node = this._findNode(word);
      if (!node) return suggestions;
  
      this._findWords(node, word, suggestions);
      return suggestions.slice(0, 5); // Limit suggestions to 5
    }
  
    _findNode(word) {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          return null;
        }
        node = node.children[char];
      }
      return node;
    }
  
    _findWords(node, prefix, results) {
      if (results.length >= 5) return; // Limit the number of results
  
      if (node.isEndOfWord) {
        results.push(prefix);
      }
      for (const char in node.children) {
        this._findWords(node.children[char], prefix + char, results);
      }
    }
  }
  
  // Sample Trie data (including Hindi words)
  export const trieData = [
    "समता", "सन्तुष्ट", "मूलाधार", "शक्ति", "शिव", "सर्पिणी",
    "कुण्ड", "शतदल", "कमल", "सहस्रार", "विकास", "स्थिती"
  ];
  
  export default Trie;
  