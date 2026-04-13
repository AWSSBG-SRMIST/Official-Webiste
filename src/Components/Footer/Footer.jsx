'use client'

import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { SiMeetup } from 'react-icons/si';
import './Footer.css';

const socials = [
  { icon: <FaInstagram />, href: 'https://www.instagram.com/awscc.srmist/', label: 'Instagram', color: '#E1306C' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/company/awscc-srmist/', label: 'LinkedIn', color: '#0A66C2' },
  { icon: <SiMeetup />, href: 'https://www.meetup.com/awscc-srmist/', label: 'Meetup', color: '#ED1C40' },
  { icon: <FaGithub />, href: 'https://github.com/AWSCC-SRMIST', label: 'GitHub', color: '#ffffff' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">

        <div className="footer-socials">
          {socials.map(({ icon, href, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-badge"
              aria-label={label}
              style={{ '--social-color': color }}
            >
              <span style={{ color, display: 'flex', alignItems: 'center' }}>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} AWS Cloud Clubs - SRMIST. All Rights Reserved.
          </p>
          <p className="footer-built">
            Designed &amp; Built by the Tech Team
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
