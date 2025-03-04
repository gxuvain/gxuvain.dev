import ProjectItem from "./project"
import { Project } from "@/lib/types"

const projects: Project[] = [
    {
        title: "gxuvain.dev",
        description:
            "My personal website built with Next.js focusing on clean design and performance. The blog section is integrated to share my programming journey and tech insights.",
        url: "https://gxuvain.dev",
        category: "react",
    },
    {
        title: "Bookmarks",
        description:
            "Bookmarks is a web application written in PHP, that allows users to create and share custom pages to organize their discoveries, tips, and inspirations in the form of bookmarks (Marks). This platform aims to transform traditional bookmarks into an interactive and creative space.",
        url: "https://gitlab.com/estxbxn/bookmarks.bio",
        category: "php",
    },
    {
        title: "LinkUp",
        description:
            "LinkUp is a Discord clone application, built in Java, a text communication software designed for gaming communities. It allows users to create servers, text channels, send messages, and share files.",
        url: "https://gitlab.com/gxuvain/link-up",
        category: "java",
    },
    {
        title: "SPARQ-Inspection",
        description:
            "SPARQ-Inspection is a web application built with FastAPI and React, to manage and prepare datasets, train AI models, and use them on a fully automated industrial production line.",
        url: "",
        category: "python",
    },
    {
        title: "Trex",
        description:
            "SPARQ-Inspection is a web application built with FastAPI (Python) and React, to manage and prepare datasets, train AI models, and use them on a fully automated industrial production line.",
        url: "",
        category: "python",
    },
]

const Projects = () => {
    return (
        <div className="md:mt-40 mt-20">
            <h2 className="mt-16 text-2xl text-black dark:text-white">
                Projects
            </h2>

            <div className="mt-8 md:mt-16 space-y-8 md:space-y-12 mb-20">
                {projects.map((project, index) => (
                    <ProjectItem key={index} {...project} />
                ))}
            </div>
        </div>
    )
}

export default Projects
