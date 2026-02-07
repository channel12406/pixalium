# Email Newsletter Setup Guide

## Configuration Required

To enable the newsletter functionality, you need to set up EmailJS service. Follow these steps:

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Set up Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Connect your email provider (Gmail, Outlook, etc.)
3. Follow the setup instructions for your chosen provider
4. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create new template"
3. Set up your template with these variables:
   - `{{to_email}}` - Recipient email address
   - `{{subject}}` - Email subject
   - `{{message}}` - Email content
   - `{{from_name}}` - Sender name

### 4. Get Your Credentials
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**
3. Note down your **Template ID**

### 5. Update Configuration
Edit `src/lib/emailService.ts` and replace these values:

```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';     // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';     // Replace with your Public Key
```

### 6. Email Template Example
Here's a sample template you can use:

```
Subject: {{subject}}

Dear Subscriber,

{{message}}

Best regards,
{{from_name}}

---
You received this email because you subscribed to PixaliumDigital newsletter.
```

### 7. Test the Setup
1. Restart your development server
2. Go to Admin → Newsletter
3. Try sending a test newsletter
4. Check the browser console for any errors

## Important Notes

- **Free Plan Limitations**: EmailJS free plan allows 200 emails per month
- **Rate Limits**: There are rate limits for sending emails (usually 10 emails per 10 seconds)
- **Security**: Never commit your actual credentials to version control
- **Environment Variables**: For production, consider using environment variables

## Alternative Services

If EmailJS doesn't meet your needs, you can also use:
- **SendGrid** - More robust for larger volumes
- **Nodemailer** - Requires backend server
- **Mailchimp** - Full newsletter platform
- **AWS SES** - Amazon's email service

## Troubleshooting

If emails aren't sending:
1. Check browser console for errors
2. Verify all credentials are correct
3. Test your email service in EmailJS dashboard
4. Check spam folder for test emails
5. Ensure your email template variables match exactly

The current implementation sends emails individually to each subscriber to respect EmailJS limitations. For larger lists, consider upgrading to a premium plan or using a dedicated email service.