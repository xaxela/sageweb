# EmailJS Setup Guide for SAGE Contact Form

## Step 1: Create an EmailJS Account
1. Go to [EmailJS website](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service
1. After logging in, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Connect your Gmail account (sagecluborganisation@gmail.com)
5. Note down the **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Set up your template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Email message content
4. Save the template and note down the **Template ID**

## Step 4: Get Your Public Key
1. Go to "Account" section
2. Find your **Public Key** in the API Keys section

## Step 5: Update Configuration
Replace the placeholder values in `script.js` with your actual credentials:

```javascript
// In the submitForm method, replace:
const response = await emailjs.send(
    'YOUR_SERVICE_ID',        // ← Replace with your Service ID
    'YOUR_TEMPLATE_ID',       // ← Replace with your Template ID
    templateParams,
    'YOUR_PUBLIC_KEY'         // ← Replace with your Public Key
);
```

## Step 6: Test the Form
1. Open your website
2. Fill out the contact form
3. Submit and check if you receive the email at sagecluborganisation@gmail.com

## Improvements
- Contact form submission and EmailJS integration
- Mobile responsiveness across all pages
- Image slider functionality
- Navigation and smooth scrolling
- CMS admin interface functionality
- Form validation

## Troubleshooting
- If emails aren't sending, check the browser console for errors
- Ensure all EmailJS credentials are correctly entered
- Verify your email service is properly connected in EmailJS dashboard

## Security Notes
- The public key is safe to include in client-side code
- Never share your private keys
- EmailJS handles the email sending securely without exposing your email credentials
