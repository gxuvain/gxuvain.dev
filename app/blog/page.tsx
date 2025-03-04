import posts from "./posts"
import Post from "@/components/post"

const Blog = () => {
    return (
        <div className="h-screen flex flex-col gap-4 md:gap-8 mt-20 md:mt-32">
            <h2 className="text-2xl md:text-3xl">Hey, look it's a blog!</h2>
            <div className="mt-12 grid gap-4">
                {posts.map((post) => (
                    <Post key={post.slug} {...post} />
                ))}
            </div>
        </div>
    )
}

export default Blog
