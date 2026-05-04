export default function Page() {
  return (
    <main style={{padding: '2rem', fontFamily: 'sans-serif'}}>
      <h1>Hmmm by PB — Brief Form</h1>
      <p>Minimal demo: vyplň jméno a mail a odesli.</p>
      <form method="post" action="/api/submit">
        <label>
          Jméno<br/>
          <input name="name" required />
        </label>
        <br/><br/>
        <label>
          E-mail<br/>
          <input name="email" type="email" required />
        </label>
        <br/><br/>
        <button type="submit">Odeslat Petrovi</button>
      </form>
      <p style={{marginTop:'2rem',color:'#666'}}>
        TODO: plný 15-krokový flow + PDF generátor.
      </p>
    </main>
  );
}
