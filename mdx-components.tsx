import type { MDXComponents } from "mdx/types";

import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }) => (
      <article className="prose my-20 dark:prose-invert">
        {children}
        <div className="flex items-center gap-4">
          <Image
            src="/assets/avatar.jpg"
            alt="Avatar"
            width={600}
            height={600}
            className="rounded-full h-12 w-12"
          />
          <p>Written by Gauvain Palanga</p>
        </div>
      </article>
    ),
    ...components,
  };
}
