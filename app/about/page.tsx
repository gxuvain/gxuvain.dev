import type { Metadata } from "next";

import AboutMeSection from "@/components/about-me";
import { generateOgImageUrl } from "@/lib/utils";

import aboutMe from "./about-me";

export const metadata: Metadata = {
  title: "About | Gauvain Palanga",
  description: "More about me.",
  openGraph: {
    title: "About | Gauvain Palanga",
    description: "More about me.",
    images: [{ url: generateOgImageUrl("About"), alt: "gxuvain.dev" }],
  },
};

function About() {
  return (
    <div className="h-screen flex flex-col gap-4 md:gap-8 mt-20 md:mt-32">
      <h2 className="text-2xl md:text-3xl">About me</h2>
      <AboutMeSection {...aboutMe} />
    </div>
  );
}

export default About;
