export interface Project {
    title: string;
    description: string;
    url: string;
    category: "python" | "react" | "java" | "php";
}

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags?: string[];
}
