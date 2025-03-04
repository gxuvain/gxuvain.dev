import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";

const About = () => {
    return (
        <div>
            <ViewTransition name="avatar">
                <Image
                    src="/assets/avatar.jpeg"
                    alt="Avatar"
                    width={200}
                    height={200}
                    className="rounded-full h-16 w-16 md:h-24 md:w-24"
                />
            </ViewTransition>
        </div>
    );
};

export default About;
