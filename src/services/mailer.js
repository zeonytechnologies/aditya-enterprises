export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html })
    });
    
    if (!response.ok) {
      throw new Error(`Email failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
