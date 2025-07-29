import React from "react";

export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e0e7ff",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 14,
          boxShadow: "0 5px 32px 0 rgba(62, 69, 150, 0.10)",
        }}
      >
        <h1 style={{ color: "#4f46e5" }}>Hoşgeldiniz!</h1>
        <p>Giriş başarılı.</p>
      </div>
    </div>
  );
}