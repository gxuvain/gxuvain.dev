import { AboutMe } from "@/lib/types"

const AboutMeSection = ({ description, skills, future, footer }: AboutMe) => {
    return (
        <>
            <p>{description}</p>
            <h2 className="text-2xl md:text-3xl">Tech Stack</h2>
            <p>What i know</p>
            <ul>
                {skills?.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
            <p>What i want to learn</p>
            <p>{future}</p>
            <p>{footer}</p>
        </>
    )
}

export default AboutMeSection
