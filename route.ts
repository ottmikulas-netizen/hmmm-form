import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');

  const petrEmail = process.env.PETR_EMAIL;
  const mailFrom = process.env.MAIL_FROM;

  if (!petrEmail || !mailFrom) {
    console.error('Missing env', { petrEmail, mailFrom });
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: mailFrom,
      to: [petrEmail, email],
      subject: `Hmmm brief: ${name || '(bez jména)'}`,
      html: `<p>Jméno: ${name}</p><p>Email: ${email}</p><p>TODO: PDF</p>`,
    });
  } catch (e: any) {
    console.error('submit error', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.redirect('/', { status: 303 });
}
