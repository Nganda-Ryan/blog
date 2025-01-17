import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from '../seo'
import { getAuthorList, urlFor } from '../../../sanity/sanity-utils';

export const metadata = genPageMetadata({ title: 'About' })

export default async function Page() {
  const authorList = await getAuthorList();
  const author = authorList[0];
  const mainContent = {
    name: author.name, 
    avatar: urlFor(author.image), 
    occupation: "Fullstack developer", 
    company: "ARON", 
    email: author.mail, 
    twitter: author.x, 
    // bluesky: author., 
    linkedin: author.linkedin, 
    github: author.github
  }

  return (
    <>
      <AuthorLayout content={mainContent}>
        <div>
          Software Engineer, Fullstack developer (React, Next.js, Vue.js, NestJS, Spring Boot) and Salesforce developerI'm the kind of 
          person who sees a blank screen as a playground for creativity and challenges as puzzles waiting to be solved.
          <br />
          But hey, life isn't all code. When I'm not crafting clean, collaborative solutions, you'll find me sharing knowledge or 
          rocking out on my guitar or indulging in waffles (the official fuel for brilliance, trust me). I bring a mix of creativity, 
          professionalism, and a touch of humor to deliver solutions that truly solve problems and make an impact.
        </div>
      </AuthorLayout>
    </>
  )
}

export const revalidate = parseInt(process.env.NEXT_PUBLIC_ABOUT_REVALIDATION_TIME || '86400', 10); //2 weeks revalidation
