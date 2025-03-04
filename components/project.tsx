import { Project } from "@/lib/types";
import Python from "@/components/svg/python";
import React from "@/components/svg/react";
import Link from "next/link";
import Php from "./svg/php";
import Java from "./svg/java";

const ProjectItem = ({ title, description, url, category }: Project) => {
    return (
        <Link className="group block" href={url} target="_blank">
            <div className="flex gap-2 items-center">
                <h3 className="text-black">{title}</h3>
                {category === "React" ? (
                    <React className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : category === "Python" ? (
                    <Python className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : category === "PHP" ? (
                    <Php className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                ) : (
                    <Java className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                )}
            </div>
            <p className="mt-2 text-xs md:text-sm">{description}</p>
        </Link>
    );
};

export default ProjectItem;
