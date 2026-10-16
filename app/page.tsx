import { PublicLanding } from '@/components/public/PublicLanding'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tomás Fotografía | Portafolio & Coberturas',
  description:
    'Portafolio fotográfico oficial y galerías de coberturas de Tomás Fotografía.',
}

export default function HomePage() {
  return <PublicLanding />
}
