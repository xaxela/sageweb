# GitHub CMS for SAGE Club

This is a lightweight Content Management System (CMS) designed specifically for GitHub Pages. It allows you to manage slider images, team photos, club patrons, and updates without any server-side processing.

## Features

- **Dynamic Image Loading**: Automatically loads images from specified directories
- **Team Management**: Displays team member photos and information
- **Slider Management**: Manages hero/slider images
- **Updates System**: Shows latest news and announcements
- **GitHub Compatible**: Works entirely with static files (HTML, CSS, JavaScript)
- **Responsive Design**: Works on all devices

## How to Use

### Adding New Slider Images
1. Upload your images to the `IMAGES/slider/` directory
2. Name them sequentially: `slidder1.jpeg`, `slidder2.jpeg`, etc.
3. The CMS will automatically detect and display them

### Adding Team Photos
1. Upload team member photos to the `IMAGES/TEAM/` directory
2. Use descriptive filenames like: `president.jpg`, `vice-president.jpg`, etc.
3. The system will automatically display them in the team section

### Adding Club Patrons
1. Upload patron photos to the `IMAGES/TEAM/` directory (or create `IMAGES/PATRONS/`)
2. Name them: `patron1.jpg`, `patron2.jpg`, etc.
3. They will appear in the patrons section

### Adding Updates
1. Create a file named `updates.json` in the `UPDATES/` directory
2. Format it like this:
```json
{
  "updates": [
    {
      "title": "Your update title",
      "date": "2024-01-15",
      "content": "Your update content here"
    }
  ]
}
```

## File Structure
```
cms/
├── index.html          # Main CMS interface
├── cms-styles.css      # Styling for the CMS
├── cms-script.js       # JavaScript functionality
└── README.md          # This documentation

IMAGES/
├── slider/            # Slider images
├── TEAM/              # Team member photos
└── PATRONS/           # Club patron photos (optional)

UPDATES/
└── updates.json       # News and updates
```

## Accessing the CMS
Navigate to: `https://yourusername.github.io/your-repo/cms/`

## Technical Details
- **No Database Required**: Uses GitHub's file system
- **No Server-Side Code**: Pure HTML, CSS, and JavaScript
- **Auto-Detection**: Automatically detects repository and branch
- **Responsive**: Works on desktop, tablet, and mobile
- **Fast Loading**: Optimized for GitHub Pages

## Customization
You can customize the CMS by editing:
- `cms-styles.css` for styling
- `cms-script.js` for functionality
- `index.html` for layout

## Troubleshooting
- Ensure images are in the correct directories
- Check that filenames match the expected patterns
- Verify that `updates.json` is valid JSON
- Check browser console for any JavaScript errors

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers
