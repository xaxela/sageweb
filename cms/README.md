# SAGE CMS Documentation

## Overview
This is a GitHub-compatible Content Management System (CMS) for the SAGE website. It allows content management without server-side processing, working entirely with static files.

## Features
- **Dynamic Image Loading** - Automatically detects images from directories
- **Team Management** - Displays team member photos and information
- **Slider Management** - Manages hero/slider images
- **News System** - Shows latest updates and announcements
- **GitHub Compatible** - Works within GitHub Pages limitations
- **Responsive Design** - Works on all devices

## How to Use

### 1. Access the CMS
Navigate to: `https://yourusername.github.io/your-repo/cms/`

### 2. Adding Slider Images
1. Upload images to the `IMAGES/slider/` directory
2. Name them sequentially: `slidder1.jpeg`, `slidder2.jpeg`, etc.
3. The system automatically detects and displays them

### 3. Adding Team Photos
1. Upload team member photos to `IMAGES/TEAM/` directory
2. Use descriptive filenames like: `president.jpg`, `vice-president.jpg`
3. The CMS automatically displays them with their roles

### 4. Adding Club Patrons
1. Upload patron photos to `IMAGES/TEAM/` (or create `IMAGES/PATRONS/`)
2. Name them: `patron1.jpg`, `patron2.jpg`
3. They appear in the patrons section automatically

### 5. Adding News/Updates
1. Edit the `UPDATES/updates.json` file
2. Add new entries in this format:

```json
{
  "title": "Your news title",
  "date": "2024-01-20",
  "content": "Your news content here"
}
```

## File Structure
```
cms/
├── index.html          # Main CMS interface
├── cms-styles.css      # CMS styling
├── cms-script.js       # JavaScript functionality
├── config.json         # CMS configuration
└── README.md          # This file

UPDATES/
└── updates.json       # News and updates
```

## Technical Details
- **No Database Required** - Uses GitHub's file system as storage
- **Auto-detection** - JavaScript scans directories for new files
- **Auto-refresh** - Updates every 5 minutes automatically
- **GitHub Compatible** - Works entirely within GitHub Pages limitations

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Troubleshooting

### Images Not Loading
1. Check file extensions (use .jpg, .jpeg, .png, .webp)
2. Ensure files are in correct directories
3. Check console for JavaScript errors

### CMS Not Updating
1. Clear browser cache
2. Check if files are properly committed to GitHub
3. Wait 5-10 minutes for GitHub Pages to update

### Mobile Issues
1. Test on actual mobile devices
2. Check viewport meta tag
3. Ensure images are optimized for mobile

## Development Notes
- All changes are reflected immediately after GitHub Pages deployment
- No build process required
- Works with GitHub's static hosting limitations
- Supports modern browsers only

## Support
For technical support, contact the development team or check the main project documentation.
