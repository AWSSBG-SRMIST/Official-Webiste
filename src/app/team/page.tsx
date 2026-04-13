import type { Metadata } from 'next'
import NavBar from '../../Components/NavBar/NavBar'
import TeamSection from '../../Components/TeamSection/TeamSection'
import Footer from '../../Components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Team | AWSCC-SRMIST',
  description: 'Meet the team behind AWS Cloud Clubs - SRMIST. Captains, Directors, Leads, and Co-Leads across Technical, Corporate, and Creatives domains.',
}

export default function TeamPage() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }}>
        <TeamSection />
      </div>
      <Footer />
    </>
  )
}
