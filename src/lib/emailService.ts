import emailjs from '@emailjs/browser';

// Initialize EmailJS with your service credentials
// You'll need to create an account at https://www.emailjs.com/ and get these values
const EMAILJS_SERVICE_ID = 'service_8oc5o66'; // Your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = 'template_njys0y8'; // Your EmailJS Template ID
const EMAILJS_PUBLIC_KEY = 'jHzIeHYnyKVZb5zPF'; // Your EmailJS Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface NewsletterData {
  subject: string;
  content: string;
  recipients: string[];
}

export async function sendNewsletter(data: NewsletterData): Promise<boolean> {
  try {
    // Send email to each recipient
    const sendPromises = data.recipients.map(async (email) => {
      const templateParams = {
        to_email: email,
        subject: data.subject,
        message: data.content,
        from_name: 'PixaliumDigital'
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log(`Email sent successfully to: ${email}`);
        return { email, success: true };
      } catch (error) {
        console.error(`Failed to send email to: ${email}`, error);
        return { email, success: false, error };
      }
    });

    const results = await Promise.all(sendPromises);
    const successfulSends = results.filter(result => result.success).length;
    
    console.log(`Newsletter sent to ${successfulSends}/${data.recipients.length} recipients`);
    return successfulSends > 0;
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return false;
  }
}

// Alternative implementation using a single template with multiple recipients
// This requires EmailJS premium plan for bulk sending
export async function sendNewsletterBulk(data: NewsletterData): Promise<boolean> {
  try {
    const templateParams = {
      to_emails: data.recipients.join(','),
      subject: data.subject,
      message: data.content,
      from_name: 'PixaliumDigital'
    };

    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Bulk newsletter sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending bulk newsletter:', error);
    return false;
  }
}

// Test function to verify EmailJS configuration
export async function testEmailService(): Promise<boolean> {
  try {
    const testParams = {
      to_email: 'test@example.com',
      subject: 'Test Email from PixaliumDigital',
      message: 'This is a test email to verify the email service is working correctly.',
      from_name: 'PixaliumDigital Test'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, testParams);
    console.log('Email service test successful');
    return true;
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
}