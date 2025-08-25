# SAGE Club CMS Documentation

## Overview
The SAGE Club Content Management System (CMS) is a modern admin interface designed to manage website content including slider images, team members, club patrons, and updates. The CMS provides an intuitive interface for content management without requiring technical knowledge.

## Features

### Dashboard
- **Real-time Statistics**: View counts of slider images, team members, patrons, and updates
- **Recent Activity Feed**: Track recent CMS activities
- **Auto-refresh**: Content refreshes automatically every 5 minutes

### Slider Management
- **View Slider Images**: Browse all slider images with previews
- **Upload New Images**: Add new slider images with titles and descriptions
- **Edit Images**: Modify image metadata (title, description)
- **Delete Images**: Remove unwanted slider images

### Team Management
- **Team Member Directory**: View all team members with photos
- **Add Team Members**: Upload new team member profiles
- **Edit Profiles**: Update team member information
- **Remove Members**: Delete team member entries

### Patron Management
- **Patron Directory**: View club patrons
- **Add Patrons**: Upload new patron profiles
- **Edit Patron Info**: Update patron details
- **Remove Patrons**: Delete patron entries

### Updates Management
- **News & Announcements**: View all website updates
- **Add Updates**: Create new announcements and news items
- **Edit Updates**: Modify existing update content
- **Delete Updates**: Remove outdated announcements

### Settings
- **GitHub Integration**: Configure repository settings for content deployment
- **Content Paths**: Customize file paths for different content types
- **Local Storage**: Settings are saved locally for convenience

## File Structure

```
cms/
├── index.html          # Main CMS interface
├── dashboard.js        # Dashboard functionality and navigation
├── media-manager.js    # Image upload and management
├── content-editor.js   # Update content management (to be implemented)
├── cms-styles.css      # CMS styling and responsive design
├── sw.js              # Service worker for offline functionality
└── README.md          # This documentation file
```

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub repository for content storage
- Basic understanding of file management

### Setup Steps

1. **Clone or Download the CMS Files**
   ```bash
   git clone <your-repository-url>
   cd cms
   ```

2. **Configure GitHub Settings**
   - Open the CMS dashboard
   - Navigate to Settings section
   - Enter your GitHub username, repository name, and branch
   - Click "Save Settings"

3. **Configure Content Paths**
   - Update the content paths in Settings if needed:
     - Slider Images: `../IMAGES/slider/`
     - Team Photos: `../IMAGES/TEAM/`
     - Updates JSON: `../UPDATES/updates.json`

4. **Start Using the CMS**
   - Open `cms/index.html` in your web browser
   - Begin managing your content through the intuitive interface

## Usage Guide

### Adding New Content

1. **Slider Images**
   - Navigate to "Slider Images" section
   - Click "Upload New Image"
   - Select image file (max 5MB)
   - Add title and description
   - Click "Upload"

2. **Team Members**
   - Navigate to "Team Members" section
   - Click "Add Team Member"
   - Upload photo and add details
   - Save the entry

3. **Club Patrons**
   - Navigate to "Club Patrons" section
   - Click "Add Patron"
   - Upload photo and add information
   - Save the entry

4. **Updates**
   - Navigate to "Updates" section
   - Click "Add Update"
   - Enter title, date, and content
   - Save the update

### Editing Existing Content

1. **Images and Profiles**
   - Navigate to the relevant section
   - Click the "Edit" button on any item
   - Modify the details
   - Save changes

2. **Updates**
   - Go to the Updates section
   - Click "Edit" on any update
   - Update the content
   - Save changes

### Deleting Content

1. **Any Content Type**
   - Navigate to the relevant section
   - Click "Delete" on the item you want to remove
   - Confirm the deletion in the popup dialog

## Technical Details

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Storage
- Uses localStorage for saving settings
- No server-side storage required
- All content managed through GitHub repository

### Security Features
- Client-side only (no server vulnerabilities)
- File type validation for uploads
- File size limits (5MB max)
- No sensitive data storage

## Customization

### Styling
Modify `cms-styles.css` to customize the appearance:
- Color scheme in CSS variables
- Layout and spacing
- Responsive breakpoints

### Functionality
Extend functionality by modifying:
- `dashboard.js` for core features
- `media-manager.js` for upload handling
- `content-editor.js` for update management

## Troubleshooting

### Common Issues

1. **Images Not Loading**
   - Check file paths in Settings
   - Verify images exist in specified directories
   - Ensure proper file permissions

2. **Uploads Not Working**
   - Check browser console for errors
   - Verify file size (max 5MB)
   - Ensure supported file types (JPEG, PNG, GIF)

3. **Settings Not Saving**
   - Check browser localStorage support
   - Try refreshing the page

4. **Layout Issues**
   - Check browser compatibility
   - Clear browser cache

### Browser Console Commands
For debugging, use these console commands:
```javascript
// View current settings
console.log(JSON.parse(localStorage.getItem('cms-config')));

// Force refresh content
cms.loadDashboard();

// Check image existence
cms.imageExists('image-url.jpg').then(exists => console.log(exists));
```

## Future Enhancements

### Planned Features
- **Bulk Operations**: Multiple file uploads and batch edits
- **Image Cropping**: Built-in image editing tools
- **Version Control**: Content revision history
- **Export/Import**: Backup and restore functionality
- **User Roles**: Multi-user access with permissions
- **API Integration**: Direct GitHub API integration
- **Real-time Sync**: Live content synchronization
- **Analytics**: Usage statistics and reports

### Technical Improvements
- **Performance Optimization**: Faster image loading and processing
- **Offline Support**: Enhanced service worker functionality
- **Accessibility**: Improved screen reader support
- **Internationalization**: Multi-language support

## Support

For technical support or feature requests:
- Check the browser console for error messages
- Review this documentation for common solutions
- Contact the development team for assistance

## Version History

### v1.0.0 (Current)
- Initial CMS release
- Basic content management functionality
- Responsive design
- GitHub integration setup

### Upcoming Versions
- Enhanced media management
- Advanced editing capabilities
- Improved user experience
- Additional integration options

---

**Note**: This CMS is designed to work with the SAGE Club website structure. Ensure your file paths match your actual directory structure for proper functionality.
