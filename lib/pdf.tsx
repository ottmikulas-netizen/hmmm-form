import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

export type SubmissionData = {
  jmeno: string;
  email: string;
  hostu?: string;
  datum?: string;
  mesto?: string;
  prostor?: string;
  casStart?: string;
  casKonec?: string;
  vibe?: string;
  note?: string;
  alergie?: string[] | string;
  omezeni?: string[] | string;
  piti?: string;
  rozpocet?: string;
  submittedAt?: string;
};

const styles = StyleSheet.create({
  page: { padding: 40 },
  h1: { fontSize: 22, marginBottom: 16 },
  row: { marginBottom: 8 },
  label: { fontSize: 10, color: '#666', textTransform: 'uppercase' },
  value: { fontSize: 13 },
});

const safe = (v: any) => (v == null ? '' : String(v));
const join = (a: any) => (Array.isArray(a) ? a.join(', ') : (safe(a) || '—'));

export async function renderPdfBuffer(data: SubmissionData, logoBase64: string) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {logoBase64 ? <Image src={logoBase64} style={{ width: 64, height: 64, marginBottom: 12 }} /> : null}
        <Text style={styles.h1}>hmmm. by PB — brief</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Jméno</Text>
          <Text style={styles.value}>{safe(data.jmeno)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{safe(data.email)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Počet hostů</Text>
          <Text style={styles.value}>{safe(data.hostu)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Datum</Text>
          <Text style={styles.value}>{safe(data.datum)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Místo</Text>
          <Text style={styles.value}>{safe(data.mesto)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Poznámka</Text>
          <Text style={styles.value}>{safe(data.note)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alergie</Text>
          <Text style={styles.value}>{join(data.alergie)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Omezení</Text>
          <Text style={styles.value}>{join(data.omezeni)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rozpočet</Text>
          <Text style={styles.value}>{safe(data.rozpocet)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>submittedAt</Text>
          <Text style={styles.value}>{safe(data.submittedAt)}</Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
