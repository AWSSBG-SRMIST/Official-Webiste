'use client'

import React, { useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import AccordionItem from './AccordionItem/AccordionItem';
import './Faq.css';

const faqs = [
  {
    question: 'Who can join AWS Cloud Clubs - SRMIST?',
    answer: 'AWS Cloud Clubs - SRMIST is open to students from the School of Computing, SRMIST KTR — from 1st to 3rd year. If you\'re curious about cloud computing, you\'re welcome here.',
  },
  {
    question: 'Is there a membership fee?',
    answer: 'No. Membership is completely free. We believe in making cloud education accessible to every eligible SRM student without any financial barrier.',
  },
  {
    question: 'Do I need any certification to join?',
    answer: 'Yes, at least one AWS certification or badge is required — it can be any AWS-issued certificate or badge, even a free course completion badge. Any domain, any level.',
  },
  {
    question: 'Do you provide training for AWS certifications?',
    answer: 'Yes. We collaborate with AWS Academy - SRMIST, AWS Heroes, and community members to provide everything you need for training. We do prepare you for globally recognised AWS certifications.',
  },
  {
    question: 'How often do you host events?',
    answer: 'We host at least one event per quarter of the year — workshops, speaker sessions, hackathons, and more. Follow our socials to stay updated.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about joining"
        />
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
