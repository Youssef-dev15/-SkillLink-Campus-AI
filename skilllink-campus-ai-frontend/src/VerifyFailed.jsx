const VerifyFailed = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>❌ Verification   Failed</h1>
      <p>The verification link is invalid or expired.</p>
      <a href="/signup">Back to Signup</a>
    </div>
  );
};

export default VerifyFailed;
