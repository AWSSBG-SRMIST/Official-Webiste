'use client'

import { useState, useEffect } from 'react'
import Loader from '../Components/Loader/Loader'
import NavBar from '../Components/NavBar/NavBar'
import Hero from '../Components/Hero/Hero'
import AboutSection from '../Components/AboutSection/AboutSection'
import Benefits from '../Components/Benefits/Benefits'
import ContributeSection from '../Components/ContributeSection/ContributeSection'
import CtaSection from '../Components/CtaSection/CtaSection'
import Footer from '../Components/Footer/Footer'

export default function HomeClient() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <Loader />}
      <NavBar />
      <Hero />
      <AboutSection />
      <Benefits />
      <ContributeSection />
      <CtaSection />
      <Footer />
    </>
  )
}
