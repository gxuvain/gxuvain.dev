import type { Technologies } from "@/lib/types"

const technologies = [
    {
        name: "HTML",
        category: "frontend",
    },
    {
        name: "CSS",
        category: "frontend",
    },
    {
        name: "JavaScript",
        category: "frontend",
    },
    {
        name: "TypeScript",
        category: "frontend",
    },
    {
        name: "React",
        category: "frontend",
    },
    {
        name: "Next.js",
        category: "frontend",
    },
    {
        name: "Tailwind CSS",
        category: "frontend",
    },
    {
        name: "Python",
        category: "backend",
    },
    {
        name: "PHP",
        category: "backend",
    },
    {
        name: "Java",
        category: "backend",
    },
    {
        name: "MongoDB",
        category: "databases",
    },
    {
        name: "SQL",
        category: "databases",
    },
    {
        name: "Git",
        category: "version control",
    },
    {
        name: "GitHub",
        category: "version control",
    },
    {
        name: "GitLab",
        category: "version control",
    },
    {
        name: "Docker",
        category: "other",
    },
    {
        name: "Linux",
        category: "other",
    },
] as Technologies[]

const Technologies = () => {
    return (
        <div className="flex flex-col flex-wrap justify-center gap-4">
            <h2>Coming soon...</h2>
        </div>
    )
}

export default Technologies
