import { ImageResponse } from "next/og";
import { WORKSHOP_CONFIG as cfg } from "@/config";

export const alt = cfg.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#991B1B",
          color: "white",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.1 }}>{cfg.title}</div>
        <div style={{ fontSize: 34, marginTop: 24, opacity: 0.92 }}>
          Leave with a live AI project link for your resume
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 30,
            fontWeight: 700,
            background: "#FFB218",
            color: "#1E293B",
            padding: "12px 28px",
            borderRadius: 14,
            alignSelf: "flex-start",
          }}
        >
          FREE · 60 MIN · 2027 BATCH
        </div>
      </div>
    ),
    size,
  );
}
