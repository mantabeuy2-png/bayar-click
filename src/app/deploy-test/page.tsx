export const dynamic = "force-static";

export default function DeployTest() {
  return (
    <html>
      <body style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>🚀 Deploy Test</h1>
        <p>Commit: 08c09de7</p>
        <p>Time: {new Date().toISOString()}</p>
        <p>Match: dashboard fix v2</p>
      </body>
    </html>
  );
}
