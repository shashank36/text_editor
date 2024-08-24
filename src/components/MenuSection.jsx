import React from 'react';
import { Box, Button } from '@mui/material';

const MenuSection = ({ selectedPattern, handleMenuClick }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Button
      variant={selectedPattern === 'Modify Number Hyphen' ? 'contained' : 'outlined'}
      onClick={() => handleMenuClick('Modify Number Hyphen')}
    >
      Modify Number Hyphen
    </Button>
    <Button
      variant={selectedPattern === 'Modify Character Hyphen' ? 'contained' : 'outlined'}
      onClick={() => handleMenuClick('Modify Character Hyphen')}
    >
      Modify Character Hyphen
    </Button>
    {/* Add more buttons for other patterns */}
  </Box>
);

export default MenuSection;
