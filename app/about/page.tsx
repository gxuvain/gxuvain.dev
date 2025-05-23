import Technologies from "@/components/technologies"
import { generateOgImageUrl } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About | Gauvain Palanga",
    description: "More about me.",
    openGraph: {
        title: "About | Gauvain Palanga",
        description: "More about me.",
        images: [{ url: generateOgImageUrl("About"), alt: "gxuvain.dev" }],
    },
}

const About = () => {
    return (
        <div className="h-screen flex flex-col gap-4 md:gap-8 mt-20 md:mt-32">
            <h2 className="text-2xl md:text-3xl">About</h2>
            <p>A little bit of myself</p>
            <p>
                My name is Gauvain Palanga, I&apos;m 19 years old, and I&apos;m
                passionate about programming. Since a young age, I have always
                wanted to build things, and at 17, I discovered programming and
                fell in love with it! Today, I am focusing on web development
                because I&apos;m a child of the internet, so it seems quite
                natural to be part of it, right? Currently, I&apos;m in my 2nd
                year of BTS SIO at CCI Campus Strasbourg, and I plan to join an
                engineering school in the coming years to improve my skills and
                become a software engineer. In my free time, I also enjoy
                listening to music, especially hardcore music, and I love
                reading manga and watching anime because I&apos;m a big fan of
                Japanese culture.
            </p>
            <Technologies />
        </div>
    )
}

export default About
