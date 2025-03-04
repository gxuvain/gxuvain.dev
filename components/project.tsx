import { Project } from "@/lib/types";
import Python from "@/components/svg/python";
import React from "@/components/svg/react";
import Link from "next/link";
import Php from "./svg/php";
import Java from "./svg/java";
import Balancer from "react-wrap-balancer";

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
                    <React className="grayscale-0 md:grayscale opacity-100 md:opacity-50 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : category === "python" ? (
                    <Python className="grayscale-0 md:grayscale opacity-100 md:opacity-50 duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : category === "php" ? (
                    <Php className="grayscale-0 md:grayscale opacity-100 md:opacity-50 duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : (
                    <Java className="grayscale-0 md:grayscale opacity-100 md:opacity-50 duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                )}
            </div>
            <Balancer>
                <p className="mt-2 text-xs md:text-sm">{description}</p>
            </Balancer>
        </Link>
    );
};

export default ProjectItem;
