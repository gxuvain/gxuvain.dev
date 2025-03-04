import ProjectItem from "./project";
import { Project } from "@/lib/types";

const projects: Project[] = [
    {
        title: "Project 1",
        description: "Description 1",
        url: "https://example.com",
        category: "Python",
    },
    {
        title: "Project 2",
        description: "Description 2",
        url: "https://example.com",
        category: "React",
    },
    {
        title: "Project 3",
        description: "Description 3",
        url: "https://example.com",
        category: "Java",
    },
    {
        title: "Project 4",
        description: "Description 4",
        url: "https://example.com",
        category: "PHP",
    },
];

const Projects = () => {
    return (
        <div className="md:mt-40 mt-20">
            <h2 className="mt-16 text-2xl text-black">Projects</h2>

            <div className="mt-8 md:mt-16 space-y-8 md:space-y-12">
                {projects.map((project, index) => (
                    <ProjectItem key={index} {...project} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
