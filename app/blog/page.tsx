import Post from "@/components/post";
import posts from "./posts";

const Blog = () => {
    return (
        <div className="h-screen">
            <h1>Hey, look it's a blog!</h1>
            <div className="mt-12 grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Post key={post.slug} {...post} />
                ))}
            </div>
        </div>
    );
};

export default Blog;
