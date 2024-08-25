import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';

const MenuSection = ({ selectedPattern, handleMenuClick }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Tooltip title="Find and add space in hyphens followed by numbers: -123 --> - 123" placement="right">
      <Button
        variant={selectedPattern === 'Modify Number Hyphen' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Modify Number Hyphen')}
      >
        Modify Number Hyphen
      </Button>
    </Tooltip>
    <Tooltip title="Find and modify hyphens between characters: अलग-अलग --> अलग - अलग" placement="right">
      <Button
        variant={selectedPattern === 'Modify Character Hyphen' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Modify Character Hyphen')}
      >
        Modify Character Hyphen
      </Button>
    </Tooltip>
    <Tooltip title="Find and modify Hindi short forms: replace पं. with  पंडित, वं० with वंदनीया or वंदनीय" placement="right">
      <Button
        variant={selectedPattern === 'Modify Hindi Short Forms' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Modify Hindi Short Forms')}
      >
        Modify Hindi Short Forms
      </Button>
    </Tooltip>

    <Tooltip title="Find and suggest all Hindi numerals" placement="right">
      <Button
        variant={selectedPattern === 'Modify Hindi Numerals' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Modify Hindi Numerals')}
      >
        Modify Hindi Numerals
      </Button>
    </Tooltip>

    <Tooltip title="Find and remove URLs from the text" placement="right">
      <Button
        variant={selectedPattern === 'Remove URLs' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Remove URLs')}
      >
        Remove URLs
      </Button>
    </Tooltip>

    <Tooltip title="Remove all English words but keep page breaks intact" placement="right">
      <Button
        variant={selectedPattern === 'Remove English Words' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Remove English Words')}
      >
        Remove English Words
      </Button>
    </Tooltip>

    <Tooltip title="Remove all special characters" placement="right">
      <Button
        variant={selectedPattern === 'Remove Special Characters' ? 'contained' : 'outlined'}
        onClick={() => handleMenuClick('Remove Special Characters')}
      >
        Remove Special Characters
      </Button>
    </Tooltip>
    {/* Add more buttons with tooltips as needed */}
  </Box>
);

export default MenuSection;
