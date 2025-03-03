import Link from "next/link";
import Github from "@/components/svg/github";

const Footer = () => {
    return (
        <div className="flex justify-center items-center space-x-4 py-8 text-sm md:text-base">
            <p>gxuvain.dev - made with love!</p>
            <Link href="https://github.com/gxuvain" target="_blank">
                <Github />
            </Link>
        </div>
    );
};

export default Footer;
