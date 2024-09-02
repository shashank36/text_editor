import React from 'react';
import './MenuSection.css';

const MenuSection = ({ selectedPattern, setSelectedPattern }) => {
  const patterns = [
    'Modify Number Hyphen',
    'Modify Character Hyphen',
    'Modify Hindi Short Forms',
    'Modify Hindi Numerals',
    'Remove URLs',
    'Remove English Words',
    'Remove Special Characters'
  ];

  return (
    <div className="menu-section">
      {patterns.map((pattern) => (
        <button 
          key={pattern}
          className={selectedPattern === pattern ? 'selected' : ''}
          onClick={() => setSelectedPattern(pattern)}
        >
          {pattern}
        </button>
      ))}
    </div>
  );
};

export default MenuSection;
