import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/config";

export const alt = `${APP_NAME} — Wedding speeches, written for you`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff1f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#e11d48" }}>{APP_NAME}</div>
        <div style={{ fontSize: 32, color: "#3f3f46", marginTop: 24 }}>
          Wedding speeches, written for you
        </div>
      </div>
    ),
    { ...size },
  );
}
