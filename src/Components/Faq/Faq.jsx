'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import AccordionItem from './AccordionItem/AccordionItem'
import './Faq.css'

const faqs = [
  {
    question: 'Who can join AWS Cloud Clubs — SRMIST?',
    answer:
      "AWS Cloud Clubs — SRMIST is open to students from the School of Computing, SRMIST KTR, from 1st to 3rd year. If you're curious about cloud computing, you're welcome here.",
  },
  {
    question: 'Is there a membership fee?',
    answer:
      'No. Membership is free. We believe in making cloud education accessible to every eligible SRM student without any financial barrier.',
  },
  {
    question: 'Do I need any certification to join?',
    answer:
      'Yes — at least one AWS certification or badge. It can be any AWS-issued certificate or badge, even a free course completion badge. Any domain, any level.',
  },
  {
    question: 'Do you provide training for AWS certifications?',
    answer:
      'Yes. We collaborate with AWS Academy — SRMIST, AWS Heroes, and community members to provide everything you need. We prepare you for globally recognised AWS certifications.',
  },
  {
    question: 'How often do you host events?',
    answer:
      'At least one per quarter — workshops, speaker sessions, hackathons and more. Follow our socials to stay updated.',
  },
]

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.faq-list', start: 'top 85%' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="faq-section section-shell" ref={sectionRef}>
      <div className="section-inner">
        <div className="faq-head">
          <span className="eyebrow">FAQ · Questions we get</span>
          <SplitText
            as="h2"
            className="display-md faq-title"
            html={'Still have questions?<br/>We have answers.'}
            types="chars"
            onSplit={({ chars }) => {
              gsap.set(chars, { yPercent: 120, opacity: 0 })
              const tween = gsap.to(chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                stagger: 0.02,
                ease: 'power4.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
              })
              return () => tween.scrollTrigger?.kill()
            }}
          />
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              num={String(i + 1).padStart(2, '0')}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
