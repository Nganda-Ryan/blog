import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from '../seo'
import { getAuthorList, urlFor } from '../../../sanity/sanity-utils';

export const metadata = genPageMetadata({ title: 'A propos' })

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
      <AuthorLayout content={mainContent} children={undefined}>
        <div>
          Ingénieur logiciel, développeur Fullstack (React, Next.js, Vue.js, NestJS, Spring Boot) et développeur Salesforce. Je suis le 
          genre de personne qui considère un écran vierge comme une aire de jeu pour la créativité, et les défis comme des énigmes à 
          résoudre.
          <br />
          <br />
          Mais la vie n'est pas faite que de code. Lorsque je ne suis pas en train d'élaborer des solutions propres et collaboratives, 
          vous me trouverez en train de partager des connaissances, de jouer de la guitare ou de manger des gaufres (le carburant 
          officiel de la brillance, croyez-moi). J'apporte un mélange de créativité, de professionnalisme et une touche d'humour pour 
          fournir des solutions qui résolvent vraiment les problèmes et qui ont un impact.
        </div>
      </AuthorLayout>
    </>
  )
}

export const revalidate = 86400
