import Java from "./svg/java"
import Php from "./svg/php"
import Python from "@/components/svg/python"
import React from "@/components/svg/react"
import { Project } from "@/lib/types"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

const ProjectItem = ({ title, description, url, category }: Project) => {
    return (
        <Link
            className="group block mx-auto text-left"
            href={url}
            target="_blank"
        >
            <div className="flex gap-2 items-center">
                <h3 className="text-black dark:text-white">{title}</h3>
                {category === "react" ? (
                    <React />
                ) : category === "python" ? (
                    <Python />
                ) : category === "php" ? (
                    <Php />
                ) : (
                    <Java />
                )}
            </div>
            <Balancer>
                <p className="mt-2 text-xs md:text-sm">{description}</p>
            </Balancer>
        </Link>
    )
}

export default ProjectItem
