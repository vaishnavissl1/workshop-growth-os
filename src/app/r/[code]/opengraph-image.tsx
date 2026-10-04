import { ImageResponse } from "next/og";
import { getInviter } from "@/lib/inviter";
import { WORKSHOP_CONFIG as cfg } from "@/config";

export const alt = cfg.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const inviter = await getInviter((await params).code.toUpperCase());
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
        <div style={{ fontSize: 34, opacity: 0.9 }}>
          {inviter ? `${inviter.firstName} from ${inviter.college} invited you` : "You're invited"}
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 20, lineHeight: 1.1 }}>{cfg.title}</div>
        {inviter?.project && (
          <div style={{ fontSize: 34, marginTop: 24 }}>{`They're building: ${inviter.project}`}</div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: 40,
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
