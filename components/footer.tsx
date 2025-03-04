import Link from "next/link";
import Github from "@/components/svg/github";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex justify-center items-center space-x-4 py-8 text-sm md:text-base">
            <p>Gauvain Palanga - {currentYear}, All rights reserverd</p>
            <Link href="https://github.com/gxuvain" target="_blank">
                <Github />
            </Link>
        </div>
    );
};

export default Footer;
