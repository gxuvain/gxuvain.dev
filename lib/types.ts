export interface Project {
    title: string;
    description: string;
    url: string;
    category: "Python" | "React" | "Java" | "PHP";
}

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags?: string[];
}
