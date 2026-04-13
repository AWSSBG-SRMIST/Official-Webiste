import type { Metadata } from 'next'
import NavBar from '../../Components/NavBar/NavBar'
import JoinGuide from '../../Components/JoinGuide/JoinGuide'
import Faq from '../../Components/Faq/Faq'
import Footer from '../../Components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Join | AWSCC-SRMIST',
  description: 'Join AWS Cloud Clubs - SRMIST. Recruitment starting soon. Follow us to stay updated.',
}

export default function Join() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }}>
        <JoinGuide />
        <Faq />
      </div>
      <Footer />
    </>
  )
}