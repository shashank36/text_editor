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
    {/* Add more buttons with tooltips as needed */}
  </Box>
);

export default MenuSection;
