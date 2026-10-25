import { useEffect } from "react"

export interface SectionInfo {
  id: string
  label: string
  shortLabel: string
  num: string
}

export const SECTIONS: SectionInfo[] = [
  { id: "home", label: "a little intro", shortLabel: "home", num: "01" },
  { id: "services", label: "what i do", shortLabel: "skills", num: "02" },
  { id: "work", label: "things i've built", shortLabel: "projects", num: "03" },
  { id: "feature", label: "a closer look", shortLabel: "featured", num: "04" },
  { id: "about", label: "a bit about me", shortLabel: "about", num: "05" },
  {
    id: "testimonials",
    label: "beyond the code",
    shortLabel: "community",
    num: "06",
  },
  { id: "contact", label: "say hello", shortLabel: "hello", num: "07" },
]
interface SlideDockProps {
  activeId: string
  onNavigate: (id: string) => void
}

export default function SlideDock({ activeId, onNavigate }: SlideDockProps) {
  const currentIndex = SECTIONS.findIndex((s) => s.id === activeId)
  const activeSection = SECTIONS[currentIndex] || SECTIONS[0]

  const handlePrev = () => {
    const nextIdx = Math.max(0, currentIndex - 1)
    onNavigate(SECTIONS[nextIdx].id)
  }

  const handleNext = () => {
    const nextIdx = Math.min(SECTIONS.length - 1, currentIndex + 1)
    onNavigate(SECTIONS[nextIdx].id)
  }

  // Keyboard navigation support: left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input/textarea
      const activeEl = document.activeElement?.tagName.toLowerCase()
      if (activeEl === "input" || activeEl === "textarea") return

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        const nextIdx = Math.min(SECTIONS.length - 1, currentIndex + 1)
        onNavigate(SECTIONS[nextIdx].id)
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        const nextIdx = Math.max(0, currentIndex - 1)
        onNavigate(SECTIONS[nextIdx].id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, onNavigate])

  return (
    <aside
      className="apple-slide-dock"
      aria-label="Slide controller"
      role="region"
    >
      {/* Previous Slide Button */}
      <button
        className="apple-dock-btn"
        onClick={handlePrev}
        disabled={currentIndex <= 0}
        aria-label="Previous slide"
        type="button"
        title="Previous slide (← key)"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path
            d="M13 16L7 10L13 4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slide Navigation Dots / Pills */}
      <nav className="apple-dock-pills" aria-label="Slides">
        {SECTIONS.map((section, idx) => {
          const isActive = section.id === activeId
          return (
            <button
              key={section.id}
              className={`apple-dock-pill ${
                isActive ? "apple-dock-pill--active" : ""
              }`}
              onClick={() => onNavigate(section.id)}
              aria-label={`Slide ${section.num}: ${section.label}`}
              aria-current={isActive ? "true" : undefined}
              type="button"
            >
              <span className="apple-dock-dot" />
              {isActive && (
                <span className="apple-dock-label">
                  <span className="apple-dock-num">{section.num}</span>
                  <span className="apple-dock-text">{section.label}</span>
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Next Slide Button */}
      <button
        className="apple-dock-btn"
        onClick={handleNext}
        disabled={currentIndex >= SECTIONS.length - 1}
        aria-label="Next slide"
        type="button"
        title="Next slide (→ key)"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path
            d="M7 16L13 10L7 4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slide Counter Indicator */}
      <div className="apple-dock-counter">
        <span>{activeSection.num}</span>
        <span className="apple-dock-counter-sep">/</span>
        <span>07</span>
      </div>
    </aside>
  )
}
