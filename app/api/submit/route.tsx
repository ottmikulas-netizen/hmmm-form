import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderPdfBuffer, SubmissionData } from '../../../lib/pdf';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

function loadLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'hmmm_logo.png');
    const buf = fs.readFileSync(logoPath);
    return 'data:image/png;base64,' + buf.toString('base64');
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Server není nakonfigurovaný — chybí RESEND_API_KEY env proměnná.' },
        { status: 500 }
      );
    }

    const sampleData: SubmissionData = { ... } as any;
    data.submittedAt = new Date().toISOString();

    if (!data.jmeno || !data.email) {
      return NextResponse.json({ error: 'Chybí jméno nebo e-mail' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const logoBase64 = loadLogoBase64();
    const pdfBuffer = await renderPdfBuffer(data, logoBase64);
    const fileName =
      'hmmm-' +
      ((data.jmeno || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) +
      '-' +
      Date.now() +
      '.pdf';

    const fromAddress = process.env.MAIL_FROM || 'Hmmm by PB <onboarding@resend.dev>';
    const petrAddress = process.env.PETR_EMAIL || 'petr@pb-dining.com';

    const petrMail = await resend.emails.send({
      from: fromAddress,
      to: petrAddress,
      replyTo: data.email,
      subject:
        'Nový brief: ' + data.jmeno + ' · ' + (data.hostu || '?') + ' hostů · ' + (data.datum || 'datum?'),
      html: petrEmailHtml(data),
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
        },
      ],
    });

    const clientMail = await resend.emails.send({
      from: fromAddress,
      to: data.email,
      replyTo: petrAddress,
      subject: 'hmmm. by PB — máme tvůj brief',
      html: clientEmailHtml(data),
      attachments: [
        {
          filename: 'tvuj-vecer-shrnuti.pdf',
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      petrMailId: petrMail.data?.id,
      clientMailId: clientMail.data?.id,
    });
  } catch (err: any) {
    console.error('submit error:', err);
    return NextResponse.json({ error: err.message || 'Něco se rozbilo' }, { status: 500 });
  }
}

function escape(s: any): string {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function join(a: any): string {
  return Array.isArray(a) ? a.join(', ') : a || '—';
}

function petrEmailHtml(d: SubmissionData): string {
  return (
    '<div style=\'font-family: Georgia, serif; background: #EDE7D9; padding: 32px; color: #1A1A1A;\'>' +
    '<div style=\'max-width: 540px; margin: 0 auto;\'>' +
    '<p style=\'font-size: 11px; letter-spacing: 2px; color: #968E7E; text-transform: uppercase;\'>nový brief</p>' +
    '<h1 style=\'font-size: 28px; margin: 8px 0 20px; font-weight: normal;\>' +
    escape(d.jmeno) +
    ' · <em style=\'color: #B6553A;\>' +
    escape(d.hostu || '?') +
    ' hostů</em>' +
    '</h1>' +
    '<table style=\'width: 100%; border-collapse: collapse; font-size: 14px;\'>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E; width: 140px;\'>datum</td><td>' +
    escape(d.datum) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>místo</td><td>' +
    escape(d.mesto) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>typ prostoru</td><td>' +
    escape(d.prostor) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>čas (start)</td><td>' +
    escape(d.casStart) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>čas (konec)</td><td>' +
    escape(d.casKonec) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>vibe</td><td>' +
    escape(d.vibe) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>note</td><td>' +
    escape(d.note) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>alergie</td><td style=\'color: #B6553A;\'>' +
    escape(join(d.alergie)) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>omezení</td><td>' +
    escape(join(d.omezeni)) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>alkohol</td><td>' +
    escape(d.piti) +
    '</td></tr>' +
    '<tr><td style=\'padding: 6px 0; color: #968E7E;\'>rozpočet</td><td>' +
    escape(d.rozpocet) +
    '</td></tr>' +
    '</table>' +
    '<p style=\'margin-top: 22px; font-size: 13px; color: #968E7E;\'>submittedAt: ' +
    escape(d.submittedAt) +
    '</p>' +
    '</div></div>'
  );
}

function clientEmailHtml(d: SubmissionData): string {
  return (
    '<div style=\'font-family: Georgia, serif; background: #EDE7D9; padding: 32px; color: #1A1A1A;\'>' +
    '<div style=\'max-width: 540px; margin: 0 auto;\'>' +
    '<h1 style=\'font-size: 26px; margin: 0 0 12px; font-weight: normal;\'>hmmm.</h1>' +
    '<p style=\'font-size: 16px; line-height: 1.6;\'>Díky — máme tvůj brief. Petru přijde PDF a obratem se ozve. 😊</p>' +
    '<p style=\'font-size: 13px; line-height: 1.6; color: #968E7E;\'>Jméno: <strong style=\'color: #1A1A1A;\'>' +
    escape(d.jmeno) +
    '</strong><br/>Počet hostů: ' +
    escape(d.hostu) +
    '<br/>Místo: ' +
    escape(d.mesto) +
    '<br/>Datum: ' +
    escape(d.datum) +
    '</p>' +
    '</div></div>'
  );
}
