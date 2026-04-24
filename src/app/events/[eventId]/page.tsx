import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { events } from '../../../data/events'
import NavBar from '../../../Components/NavBar/NavBar'
import Footer from '../../../Components/Footer/Footer'
import GalleryClient from './GalleryClient'

interface Props {
  params: Promise<{ eventId: string }>
}

export async function generateStaticParams() {
  return events.map((e) => ({ eventId: e.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params
  const event = events.find((e) => e.id === eventId)
  if (!event) return { title: 'Event Not Found | AWSCC-SRMIST' }
  return {
    title: `${event.title} | AWSCC-SRMIST`,
    description: `Photo gallery for ${event.title} — ${event.date}`,
  }
}

export default async function EventGalleryPage({ params }: Props) {
  const { eventId } = await params
  const event = events.find((e) => e.id === eventId)
  if (!event) notFound()

  return (
    <>
      <NavBar />
      <main>
        <GalleryClient event={event} />
      </main>
      <Footer />
    </>
  )
}
