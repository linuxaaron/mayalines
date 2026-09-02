import { ImageResponse } from "next/og";

export const alt = "MAYALINES — famous quotes, love quotes, hope quotes and poetry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#d8d5cf",
        color: "#171513",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ color: "#315642", fontSize: 28, fontWeight: 700, letterSpacing: "0.22em" }}>MAYALINES</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 74, lineHeight: 1.08, marginTop: 54, maxWidth: 920, textAlign: "center" }}>
        Words worth keeping.
      </div>
      <div style={{ color: "#514b45", fontSize: 25, marginTop: 34 }}>Sourced quotes, timeless wisdom and public-domain poetry</div>
    </div>,
    size,
  );
}
