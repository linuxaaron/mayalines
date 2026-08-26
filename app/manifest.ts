import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAYALINES — Famous Quotes & Poetry",
    short_name: "MAYALINES",
    description: "Famous quotes, inspirational words, timeless wisdom and public-domain poetry.",
    start_url: "/",
    display: "standalone",
    background_color: "#d8d5cf",
    theme_color: "#d8d5cf",
    lang: "en-US",
    icons: [{ src: "/mayalines-mark.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
