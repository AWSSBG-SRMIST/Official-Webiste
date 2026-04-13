'use client'

import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './AccordionItem.css';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`accordion-item-custom ${isOpen ? 'open' : ''}`}>
      <button className="accordion-question" onClick={onClick}>
        <span>{question}</span>
        <FaChevronDown className={`accordion-icon ${isOpen ? 'rotated' : ''}`} />
      </button>
      <div className={`accordion-answer ${isOpen ? 'show' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AccordionItem;
