import { PublicLanding } from '@/components/public/PublicLanding'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tomás Fotografía | Próximos Eventos & Shows',
  description:
    'Cartelera oficial de eventos, coberturas fotográficas y venta de entradas por Tomás Fotografía.',
}

export default function HomePage() {
  return <PublicLanding />
}
