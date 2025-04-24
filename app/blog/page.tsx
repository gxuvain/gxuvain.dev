import posts from "./posts"
import Post from "@/components/post"
import { generateOgImageUrl } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog | Gauvain Palanga",
    description: "Blog posts by Gauvain Palanga.",
    openGraph: {
        title: "Blog | Gauvain Palanga",
        description: "Blog posts by Gauvain Palanga.",
        images: [{ url: generateOgImageUrl("Blog"), alt: "gxuvain.dev" }],
    },
}

const Blog = () => {
    return (
        <div className="h-screen flex flex-col gap-4 md:gap-8 mt-20 md:mt-32">
            <h2 className="text-2xl md:text-3xl">
                Hey, look it&apos;s a blog!
            </h2>
            <div className="mt-12 grid gap-4">
                {posts.map((post) => (
                    <Post key={post.slug} {...post} />
                ))}
            </div>
        </div>
    )
}

export default Blog
