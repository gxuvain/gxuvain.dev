import type { AboutMe } from "@/lib/types";

function AboutMeSection({ description, skills, future, footer }: AboutMe) {
  return (
    <>
      <p>{description}</p>
      <h2 className="text-2xl md:text-3xl">Tech Stack</h2>
      <p>What i know</p>
      <ul>
        {skills?.map(skill => <li key={skill}>{skill}</li>)}
      </ul>
      <p>What i want to learn</p>
      <p>{future}</p>
      <p>
        {footer.text}
        {" "}
        <a
          href={footer.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {footer.link.label}
        </a>
      </p>
    </>
  );
}

export default AboutMeSection;
