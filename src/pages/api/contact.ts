import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const data = await request.formData();
  const firstName = data.get('firstName')?.toString().trim();
  const lastName = data.get('lastName')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const organization = data.get('organization')?.toString().trim();
  const message = data.get('message')?.toString().trim();

  if (!firstName || !lastName || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await resend.emails.send({
    from: 'Caelus Contact Form <onboarding@resend.dev>',
    to: 'meddy@caelusindustries.com',
    replyTo: email,
    subject: `New inquiry from ${firstName} ${lastName}`,
    html: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
