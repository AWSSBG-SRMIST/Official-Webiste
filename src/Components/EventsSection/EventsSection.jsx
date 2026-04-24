'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// removed SplitText
import EventCard from './EventCard/EventCard'
import './EventsSection.css'

const EventsSection = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.events-word')
      gsap.set(words, { yPercent: 120, opacity: 0 })
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.05,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      gsap.from('.events-lede', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gsap.utils.toArray('.event-card')
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
      })
    }, gridRef)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [events])

  return (
    <section className="events-section section-shell" ref={sectionRef}>
      <div className="section-inner">
        <div className="events-head">
          <div className="events-head-top">
            <span className="eyebrow">Archive · Ongoing</span>
          </div>
          <h1 className="display-md events-title">
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <span className="events-word" style={{ display: 'inline-block' }}>Events,</span>
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <span className="events-word" style={{ display: 'inline-block' }}>workshops&nbsp;</span>
              <span className="events-word" style={{ display: 'inline-block' }}>&amp;&nbsp;</span>
              <span className="events-word" style={{ display: 'inline-block' }}>nights</span>
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <span className="events-word" style={{ display: 'inline-block' }}>spent&nbsp;</span>
              <span className="events-word" style={{ display: 'inline-block' }}>debugging.</span>
            </div>
          </h1>
          <p className="para events-lede">
            Every session, bootcamp and hackathon we&apos;ve run — shipped, photographed,
            remembered. Click a card to open the gallery.
          </p>
        </div>

        {isLoading && (
          <div className="events-grid" ref={gridRef}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="event-skeleton" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="events-error">
            <h3>Something went wrong.</h3>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <div className="events-grid" ref={gridRef}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                coverImageId={event.coverImageId}
                highlights={event.highlights}
                photoCount={event.photoCount}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="events-empty">
            <p className="events-empty-label">Status</p>
            <h2 className="display-md events-empty-title">Events coming soon.</h2>
            <p className="para">Follow us on social to be first to know when the next one drops.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSection
