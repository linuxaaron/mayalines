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
    icons: [
      { src: "/sunflower-logo.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
