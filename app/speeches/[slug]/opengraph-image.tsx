import { ImageResponse } from "next/og";
import { getSpeechGuide } from "@/lib/speechGuides";
import { APP_NAME } from "@/lib/config";

export const alt = "Speech guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSpeechGuide(slug);
  const title = guide?.title ?? APP_NAME;

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
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#e11d48",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {`${APP_NAME} guide`}
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: "#18181b", marginTop: 16 }}>
          {title}
        </div>
      </div>
    ),
    { ...size },
  );
}
