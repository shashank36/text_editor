import React, { useState } from 'react';
// import './ExplainerSection.css';

const ExplainerSection = () => {
  const [language, setLanguage] = useState('english');

  const handleLanguageToggle = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'english' ? 'hindi' : 'english'));
  };

  const steps = {
    english: [
      "1. Select a filter from the menu on the left side(e.g MODIFY NUMBER HYPHEN)",
      "2. The selected filter will highlight relevant patterns in the text.",
      "3. In highlighted section, use the suggestions to correct or modify the highlighted text.",
      "4. Scroll through the patterns using the 'Up' and 'Down' buttons.",
      "5. You can download the modified text using the 'Download Modified Text' button."
    ],
    hindi: [
        "1. बाईं ओर के मेनू से एक फ़िल्टर चुनें (उदाहरण: MODIFY NUMBER HYPHEN)।",
        "2. चयनित फ़िल्टर पाठ में प्रासंगिक पैटर्न को हाइलाइट करेगा।",
        "3. हाइलाइट किए गए अनुभाग में, हाइलाइट किए गए पाठ को सुधारने या संशोधित करने के लिए सुझावों का उपयोग करें।",
        "4. पैटर्न के माध्यम से 'ऊपर' और 'नीचे' बटन का उपयोग करके स्क्रॉल करें।",
        "5. आप 'Download Modified Text' बटन का उपयोग करके संशोधित पाठ डाउनलोड कर सकते हैं।"
      ],
      
  };

  return (
    <div className="explainer-section">
      <button className="language-toggle" onClick={handleLanguageToggle}>
        {language === 'english' ? 'Read in Hindi' : 'अंग्रेज़ी में पढ़ें'}
      </button>
      <h2>{language === 'english' ? 'How to Use the Filter Menu' : 'फ़िल्टर मेनू का उपयोग कैसे करें'}</h2>
      <ul>
        {steps[language].map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExplainerSection;
