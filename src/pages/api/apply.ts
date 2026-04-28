import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const data = await request.formData();
  const name    = data.get('name')?.toString().trim();
  const email   = data.get('email')?.toString().trim();
  const subject = data.get('subject')?.toString().trim();
  const message = data.get('message')?.toString().trim();

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await resend.emails.send({
      from: 'Caelus Careers <onboarding@resend.dev>',
      to: 'contact@caelusindustries.com',
      replyTo: email,
      subject: subject,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
