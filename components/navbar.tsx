"use client"

import ThemeSwitcher from "./theme-switcher"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
    {
        path: "/bts",
        label: "BTS SIO",
    },
]

const Navbar = () => {
    const currentPathname = `/${usePathname().split("/")[1]}`

    return (
        <nav className="mt-12 flex items-center space-x-6 md:space-x-12">
            {links.map((link) => (
                <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                        "transition-colors hover:text-gray-800 dark:hover:text-gray-200",
                        link.path === currentPathname
                            ? "text-black dark:text-white font-medium"
                            : "text-gray-600 dark:text-gray-400"
                    )}
                >
                    {link.label}
                </Link>
            ))}
            <ThemeSwitcher />
        </nav>
    )
}

export default Navbar
