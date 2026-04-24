'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import { FaDownload, FaChevronDown, FaSearch, FaTimes, FaFolderOpen, FaFolder, FaFileAlt } from 'react-icons/fa'
import { fetchYearFolders, fetchAllEventFolders, fetchFiles, getDownloadUrl } from './driveApi'
import './CertificatesSection.css'

const CertificatesSection = () => {
  const [yearFolders, setYearFolders] = useState([])
  const [eventFolders, setEventFolders] = useState([])
  const [selectedYear, setSelectedYear] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFolder, setExpandedFolder] = useState(null)
  const [folderFiles, setFolderFiles] = useState({})
  const [loadingFiles, setLoadingFiles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sectionRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const years = await fetchYearFolders()
      setYearFolders(years)
      const events = await fetchAllEventFolders(years)
      setEventFolders(events)
    } catch {
      setError('Failed to load certificates. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visibleEvents = useMemo(() => {
    if (selectedYear === 'All') return eventFolders
    return eventFolders.filter((ev) => ev.year === selectedYear)
  }, [eventFolders, selectedYear])

  const handleFolderClick = async (folder) => {
    if (expandedFolder === folder.id) {
      setExpandedFolder(null)
      return
    }
    setExpandedFolder(folder.id)
    if (folderFiles[folder.id]) return
    setLoadingFiles(folder.id)
    try {
      const files = await fetchFiles(folder.id)
      setFolderFiles((prev) => ({ ...prev, [folder.id]: files }))
    } catch {
      setFolderFiles((prev) => ({ ...prev, [folder.id]: [] }))
    } finally {
      setLoadingFiles(null)
    }
  }

  const handleDownload = (fileId) => {
    window.open(getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const head = (
    <div className="certs-head">
      <span className="eyebrow">Archive · Downloadable</span>
      <SplitText
        as="h1"
        className="display-md certs-title"
        html={'Your certificate,<br/>from any event we ran.'}
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
      <p className="para certs-lede">
        Search by name, pick a year, pull the PDF. Ground truth from the folders we keep on Drive.
      </p>
    </div>
  )

  if (loading) {
    return (
      <section className="certs-section section-shell" ref={sectionRef}>
        <div className="section-inner">
          {head}
          <div className="certs-status">
            <div className="certs-spinner" />
            <p>Fetching certificates…</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="certs-section section-shell" ref={sectionRef}>
        <div className="section-inner">
          {head}
          <div className="certs-status certs-status-error">
            <p>{error}</p>
            <button className="btn" onClick={load}>Try Again</button>
          </div>
        </div>
      </section>
    )
  }

  if (eventFolders.length === 0) {
    return (
      <section className="certs-section section-shell" ref={sectionRef}>
        <div className="section-inner">
          {head}
          <div className="certs-empty">
            <p className="certs-empty-label">Status</p>
            <h2 className="display-md">No certificates yet.</h2>
            <p className="para">Check back after the next event.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="certs-section section-shell" ref={sectionRef}>
      <div className="section-inner">
        {head}

        <div className="certs-controls">
          <div className="certs-search-wrap">
            <span className="certs-search-icon"><FaSearch /></span>
            <input
              className="certs-search"
              type="text"
              placeholder="Search by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="certs-search-clear"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="certs-year-tabs">
            {['All', ...yearFolders.map((y) => y.name)].map((yr) => (
              <button
                key={yr}
                className={`certs-year-tab ${selectedYear === yr ? 'is-active' : ''}`}
                onClick={() => setSelectedYear(yr)}
              >
                {yr === 'All' ? 'All Years' : yr}
              </button>
            ))}
          </div>
        </div>

        <div className="certs-grid">
          {visibleEvents.map((folder) => {
            const isExpanded = expandedFolder === folder.id
            const files = folderFiles[folder.id] || []
            const isFetchingFiles = loadingFiles === folder.id

            return (
              <div
                key={folder.id}
                role="button"
                tabIndex={0}
                className={`certs-folder ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => handleFolderClick(folder)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFolderClick(folder)}
                aria-expanded={isExpanded}
              >
                <div className="certs-folder-head">
                  <span className="certs-folder-icon">
                    {isExpanded ? <FaFolderOpen /> : <FaFolder />}
                  </span>
                  <div className="certs-folder-meta">
                    <span className="certs-folder-year">{folder.year}</span>
                    <span className="certs-folder-name">{folder.name}</span>
                  </div>
                  <span className={`certs-folder-chevron ${isExpanded ? 'is-open' : ''}`}>
                    <FaChevronDown />
                  </span>
                </div>

                {isExpanded && (
                  <div className="certs-file-list" onClick={(e) => e.stopPropagation()}>
                    {isFetchingFiles && (
                      <div className="certs-files-loading">
                        <div className="certs-spinner certs-spinner-sm" />
                        <span>Loading certificates…</span>
                      </div>
                    )}
                    {!isFetchingFiles && files.length === 0 && (
                      <p className="certs-files-empty">No certificates in this folder.</p>
                    )}
                    {!isFetchingFiles && files.map((file) => {
                      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
                      const query = searchQuery.trim().toLowerCase()
                      const dimmed = query && !nameWithoutExt.toLowerCase().includes(query)
                      return (
                        <div key={file.id} className={`certs-file ${dimmed ? 'is-dimmed' : ''}`}>
                          <span className="certs-file-icon"><FaFileAlt /></span>
                          <span className="certs-file-name">{nameWithoutExt}</span>
                          <button
                            className="certs-download"
                            onClick={() => handleDownload(file.id)}
                          >
                            <FaDownload /> Download
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CertificatesSection
