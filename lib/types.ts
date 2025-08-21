export type Project = {
  title: string;
  description: string;
  url: string;
  category: "python" | "react" | "java" | "php";
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
};

export type Technologies = {
  name: string;
  category: "frontend" | "backend" | "databases" | "version control" | "other";
};

export type AboutMe = {
  description: string;
  skills: string[];
  future: string[];
  footer: string;
};
