import type { Metadata } from 'next'
import NavBar from '../../Components/NavBar/NavBar'
import CertificatesSection from '../../Components/CertificatesSection/CertificatesSection'
import Footer from '../../Components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Certificates | AWSCC-SRMIST',
  description: 'Download your certificate from any AWS Cloud Club SRMIST event.',
}

export default function Certificates() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: '70px' }}>
        <CertificatesSection />
      </div>
      <Footer />
    </>
  )
}
