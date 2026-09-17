import type { MetadataRoute } from "next";
import { SPEECH_GUIDES } from "@/lib/speechGuides";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes = ["/", "/create", "/privacy", "/terms", "/refunds"].map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
  }));

  const guideRoutes = SPEECH_GUIDES.map((guide) => ({
    url: `${appUrl}/speeches/${guide.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...guideRoutes];
}
