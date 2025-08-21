import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import Github from "@/components/svg/github";
import X from "@/components/svg/x";

function Hero() {
  return (
    <div className="flex flex-col mx-auto">
      <div className="flex items-center gap-4 md:gap-8 mt-20 md:mt-32">
        <Image
          src="/assets/avatar.jpg"
          alt="Avatar"
          width={600}
          height={600}
          className="rounded-full h-16 w-16 md:h-24 md:w-24"
        />
        <h1 className="text-2xl md:text-3xl">Hi! Welcome 👋</h1>
      </div>
      <Balancer>
        <p className="mt-6 md:mt-10 max-w-3xl text-sm md:text-base">
          I am Gauvain Palanga, a passionate computer science student,
          who wants to share his love for software development.
          Currently, I am working for a company called ENGLAB, where I
          create Python and React applications.
        </p>
      </Balancer>
      <div className="mt-8 flex gap-8 items-center">
        <Link
          href="https://x.com/gxuvain"
          target="_blank"
          className="flex items-center gap-2 group text-sm md:text-base"
        >
          <X />
          Twitter
        </Link>

        <Link
          href="https://github.com/gxuvain"
          target="_blank"
          className="flex items-center gap-2 group text-sm md:text-base"
        >
          <Github />
          GitHub
        </Link>
      </div>
    </div>
  );
}

export default Hero;
