'use client'

import React from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { SiMeetup } from 'react-icons/si';
import './SocialLinks.css';

const links = [
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/company/aws-cloud-club-srm', label: 'LinkedIn' },
  { icon: <FaGithub />, href: 'https://github.com/aws-cloud-club-srm', label: 'GitHub' },
  { icon: <FaInstagram />, href: 'https://instagram.com/awsccsrm', label: 'Instagram' },
  { icon: <FaWhatsapp />, href: 'https://wa.me/910000000000', label: 'WhatsApp' },
];

const SocialLinks = ({ size = 22 }) => {
  return (
    <div className="social-links">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="social-link"
          style={{ fontSize: size }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
