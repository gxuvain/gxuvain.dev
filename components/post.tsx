import { Post } from "@/lib/types";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PostItem = ({ slug, title, description, date, tags }: Post) => {
    return (
        <Link
            href={`/blog/${slug}`}
            className="border block px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/60 duration-150"
        >
            <h3 className="text-black font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>

            <div className="flex justify-between items-center mt-3">
                <Image
                    src="/assets/avatar.jpeg"
                    alt="Avatar"
                    width={180}
                    height={180}
                    className="rounded-full size-6"
                />
                <div className="flex items-center space-x-4">
                    <p className="text-xs">{date}</p>
                    <div className="flex space-x-2">
                        {tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-amber-100 px-1.5 py-0.5 rounded-lg flex items-center"
                            >
                                <Tag className="h-2.5 w-2.5 mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostItem;
