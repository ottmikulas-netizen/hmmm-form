export const dynamic = "force-static";

export default function Page() {
  return (
    <iframe
      src="/index.html"
      style={{
        width: "100vw",
        height: "100vh",
        border: 0,
        display: "block",
      }}
    />
  );
}
