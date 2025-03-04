"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        path: "/",
        label: "Home",
    },
    {
        path: "/about",
        label: "About",
    },
    {
        path: "/blog",
        label: "Blog",
    },
];

const Navbar = () => {
    const currentPathname = `/${usePathname().split("/")[1]}`;

    return (
        <nav className="mt-12 flex space-x-6 md:space-x-12">
            {links.map((link) => (
                <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                        link.path === currentPathname && "text-black"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navbar;
