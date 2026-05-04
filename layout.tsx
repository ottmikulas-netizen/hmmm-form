export const metadata = {
  title: 'Hmmm by PB',
  description: 'Private dining client brief form',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        {children}
      </body>
    </html>
  );
}
