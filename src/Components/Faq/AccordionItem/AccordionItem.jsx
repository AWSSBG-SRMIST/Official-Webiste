'use client'

import { FaPlus } from 'react-icons/fa'
import './AccordionItem.css'

const AccordionItem = ({ num, question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
        {num && <span className="faq-num">{num}</span>}
        <span className="faq-question-text">{question}</span>
        <span className={`faq-icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <FaPlus />
        </span>
      </button>
      <div className={`faq-answer ${isOpen ? 'is-open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default AccordionItem
