import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mohamed Idbenouakrim — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            color: "#d4a853",
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          Software Engineer · Casablanca
        </div>
        <div
          style={{
            color: "#fafafa",
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          Mohamed
          <br />
          Idbenouakrim
        </div>
        <div
          style={{
            color: "#a1a1aa",
            fontSize: 20,
            lineHeight: 1.5,
            maxWidth: 640,
          }}
        >
          Building thoughtful software for the modern web.
          <br />
          Node.js · Python · FastAPI · React
        </div>
      </div>
    ),
    { ...size }
  );
}
