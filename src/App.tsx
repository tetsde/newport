import { useEffect, useState, useCallback } from "react"
import { Analytics } from "@vercel/analytics/react"

import SlideDock from "./components/SlideDock"

const Arrow = ({ dark = false }: { dark?: boolean }) => (
  <span
    aria-hidden="true"
    className={`arrow-icon ${dark ? "arrow-icon--dark" : ""}`}
  >
    <svg viewBox="0 0 20 20">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  </span>
)

interface Project {
  title: string
  type: string
  image: string
  hideOverlay?: boolean
}

const projects: Project[] = [
  {
    title: "Danang Junior Skill Up - Featuring Google AI",
    type: "Student Trainer & Co-organizer",
    image: "/assets/project-coffee.jpg",
  },
  {
    title:
      "Academic Course Delivery | Applied AI Duy Tan University x Google Gemini Academy",
    type: "Student Trainer (Lecturer Class)",
    image: "/assets/project-books.jpg",
  },
  {
    title: "PROVE",
    type: "DEVELOPER",
    image: "/assets/project-packaging.jpg",
    hideOverlay: true,
  },
  {
    title: "PRISM | AI SENTINEL",
    type: "AI ENGINEER",
    image: "/assets/project-branding.jpg",
    hideOverlay: true,
  },
]

const tools = ["Py", "API", "Docker", "Git", "AWS", "SQL", "Mongo", "LLM"]

const testimonials = [
  {
    quote:
      "His ability to convey technical knowledge is very coherent, engaging, and highly inspiring to the community.",
    author: "Nguyễn Như Hoàng Phúc",
    role: "Student, Duy Tan University",
  },
  {
    quote:
      "After the class, I was able to create my own Portfolio. I found the session very rewarding with new knowledge about AI and Gemini.",
    author: "Trần Thị Hằng",
    role: "Student, Duy Tan University",
  },
  {
    quote:
      "Super energetic and on fire. His ability to convey technical knowledge is very coherent, engaging, and highly inspiring to the community.",
    author: "Gem",
    role: "Student, FPT University Da Nang",
  },
  {
    quote: "Great, absolutely excellent.",
    author: "Nguyễn Phi Long",
    role: "Event Director, JCI Danang",
  },
  {
    quote: "Very professional.",
    author: "Lương Thuỷ Tiên",
    role: "Lecturer, VKU",
  },
]
function ProjectCard({
  project,
  className = "",
}: {
  project: Project
  className?: string
}) {
  return (
    <article
      className={`project-card ${className} relative flex flex-col justify-end`}
    >
      <img
        src={project.image}
        alt={`${project.title} - AI Project developed by Nam, AI Engineer`}
        className="absolute inset-0 z-0"
      />

      {!project.hideOverlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>

          <div className="relative z-20 p-8 flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              {project.type}
            </p>
            <h3 className="text-2xl font-bold text-white mb-2">
              {project.title}
            </h3>
          </div>
        </>
      )}
    </article>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: typeof testimonials[number]
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="card testimonial-card cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <p
        className={`testimonial-quote transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-3 md:line-clamp-none"
        }`}
      >
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="testimonial-author mt-4">
        <strong>{testimonial.author}</strong>
        <span>{testimonial.role}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home")
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      })
      setActiveSection(id)
    }
  }, [])

  // Apple smooth momentum inertia scroll on desktop
  useEffect(() => {
    let targetX = window.scrollX
    let currentX = window.scrollX
    let rafId: number | null = null
    let isWheeling = false

    const smoothScrollLoop = () => {
      const diff = targetX - currentX
      if (Math.abs(diff) > 0.5) {
        currentX += diff * 0.12 // Apple signature inertia damping
        window.scrollTo({ left: currentX, behavior: "auto" })
        rafId = requestAnimationFrame(smoothScrollLoop)
      } else {
        currentX = targetX
        window.scrollTo({ left: currentX, behavior: "auto" })
        rafId = null
        isWheeling = false
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 1100) return

      // Check if the scroll target is inside a container that can scroll vertically
      const target = e.target as HTMLElement
      const scrollContainer = target.closest(".work-grid") as HTMLElement

      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        const isScrollingUp = e.deltaY < 0
        const isScrollingDown = e.deltaY > 0

        const canScrollUp = scrollTop > 0
        const canScrollDown = Math.ceil(scrollTop + clientHeight) < scrollHeight

        // If the container can scroll vertically in that direction, let it scroll naturally
        if (
          (isScrollingUp && canScrollUp) ||
          (isScrollingDown && canScrollDown)
        ) {
          return
        }
      }

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 2) {
        e.preventDefault()
        const maxScroll =
          document.documentElement.scrollWidth - window.innerWidth
        if (!isWheeling) {
          targetX = window.scrollX
          currentX = window.scrollX
          isWheeling = true
        }
        targetX = Math.max(0, Math.min(maxScroll, targetX + e.deltaY * 1.15))
        if (rafId === null) {
          rafId = requestAnimationFrame(smoothScrollLoop)
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // Track horizontal scroll progress hairline
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollWidth - window.innerWidth
      if (maxScroll > 0) {
        const p = (window.scrollX / maxScroll) * 100
        setScrollProgress(Math.min(100, Math.max(0, p)))
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // IntersectionObserver for staggered reveal and active section dock sync
  useEffect(() => {
    const panels = document.querySelectorAll(".panel")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("panel--in-view")
            if (entry.target.id) {
              setActiveSection(entry.target.id)
            }
          }
        })
      },
      {
        threshold: 0.35,
      },
    )

    panels.forEach((p) => observer.observe(p))
    return () => observer.disconnect()
  }, [])

  // Apple spotlight effect: update CSS mouse position on hoverable cards
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll(
        ".card, .project-card, .contact-card",
      )
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        if (
          e.clientX >= rect.left - 60 &&
          e.clientX <= rect.right + 60 &&
          e.clientY >= rect.top - 60 &&
          e.clientY <= rect.bottom + 60
        ) {
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          ;(card as HTMLElement).style.setProperty("--mouse-x", `${x}px`)
          ;(card as HTMLElement).style.setProperty("--mouse-y", `${y}px`)
        }
      })
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  return (
    <main className="app--loaded">
      {/* Apple Hairline Scroll Progress Bar */}
      <div
        className="apple-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <nav className="nav" aria-label="Portfolio navigation">
        <a
          className="nav__brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("home")
          }}
        >
          nam, in progress.<span>®</span>
        </a>
        <div className="nav__links">
          <a
            href="#work"
            className={
              activeSection === "work" || activeSection === "feature"
                ? "nav__link--active"
                : ""
            }
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("work")
            }}
          >
            Work
          </a>
          <a
            href="#about"
            className={
              activeSection === "about" || activeSection === "testimonials"
                ? "nav__link--active"
                : ""
            }
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("about")
            }}
          >
            About
          </a>
          <a
            href="#contact"
            className={activeSection === "contact" ? "nav__link--active" : ""}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("contact")
            }}
          >
            Contact
          </a>
        </div>
        <a
          className="nav__status"
          href="/assets/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="download-icon">↓</span>
          Download my CV
        </a>
      </nav>

      <div className="horizontal-track">
        <section className="panel panel--home" id="home">
          <div className="bento bento--home">
            <div className="card intro-card">
              <p className="eyebrow">
                AI Trainer & AI Engineer · Da Nang, Vietnam
              </p>
              <h1>
                Ideas with
                <br />
                <span>lasting impact.</span>
              </h1>
              <p className="intro-card__copy">
                Brand identities and digital experiences for people building a
                more thoughtful world.
              </p>
            </div>

            <div className="card portrait-card">
              <img
                src="/assets/avatar.jpg"
                alt="Nam Hoai, AI Engineer and AI Trainer"
              />
              <div className="orbit" aria-hidden="true">
                <span>AVAILABLE FOR WORK · AVAILABLE FOR WORK · </span>
              </div>
            </div>

            <a className="card about-card" href="#about">
              <span className="asterisk">✦</span>
              <h2>
                Da Nang-based developer and AI trainer exploring how technology
                can become useful, reliable and human.
              </h2>
              <div className="card-footer">
                <span>About me</span>
                <Arrow />
              </div>
            </a>

            <ProjectCard project={projects[0]} className="featured-project" />
            <ProjectCard project={projects[1]} className="featured-project" />

            <a className="card latest-card" href="#work">
              <h2>
                See my latest
                <br />
                <span>work</span>
              </h2>
              <div className="card-footer">
                <span>Selected projects</span>
                <Arrow />
              </div>
            </a>
          </div>
        </section>

        <section className="panel panel--services" id="services">
          <div className="bento bento--services">
            <div className="card stats-card">
              <div>
                <strong>500+</strong>
                <span>Students trained directly</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>AI Projects</span>
              </div>
              <div>
                <strong>07+</strong>
                <span>Months in a Google Student program</span>
              </div>
              <div>
                <strong>4.8/5</strong>
                <span>Average rating</span>
              </div>
            </div>

            <div className="card services-card">
              <p className="eyebrow">What I do</p>
              <ul>
                <li>
                  <span>01</span> Build AI Applications
                </li>
                <li>
                  <span>02</span> Train People with AI
                </li>
                <li>
                  <span>03</span> Develop AI Agents
                </li>
                <li>
                  <span>04</span> AI Projects
                </li>
              </ul>
            </div>

            <div className="card tools-card">
              <p className="eyebrow">Tools I use</p>
              <div className="tool-grid">
                {tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <p className="tools-card__note">
                The right tools, in service of the right idea.
              </p>
            </div>

            <a className="card wide-cta" href="#contact">
              <p className="eyebrow">Have a project in mind?</p>
              <h2>
                Let&apos;s make
                <br />
                <span>something memorable.</span>
              </h2>
              <Arrow />
            </a>

            <a className="card services-summary" href="#work">
              <p className="eyebrow">Selected capabilities</p>
              <h2>
                Built for bold
                <br />
                <span>new beginnings.</span>
              </h2>
              <div className="card-footer">
                <span>Explore projects</span>
                <Arrow />
              </div>
            </a>
          </div>
        </section>

        <section className="panel panel--work" id="work">
          <div className="work-heading">
            <p>Selected work · 2026</p>
            <h2>
              Building &
              <br />
              <span>Exploring</span>
            </h2>
          </div>
          <div className="work-grid">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </div>
        </section>

        <section className="panel panel--feature" id="feature">
          <div className="feature-copy">
            <p className="eyebrow">Case study · Generative AI Integration</p>
            <h2>
              The future of work,
              <br />
              <span>reimagined.</span>
            </h2>
            <p>
              Designing, developing, and deploying intelligent AI systems and
              training programs that bring cutting-edge generative AI
              capabilities into practical workflows.
            </p>
            <a href="#contact">
              View case study <Arrow />
            </a>
          </div>
          <div className="feature-image">
            <img
              src="/assets/case-study.jpg"
              alt="Northline coffee packaging project"
            />
            <span>01 / 04</span>
          </div>
        </section>

        <section className="panel panel--about" id="about">
          <div className="about-portrait">
            <img
              src="/assets/avatar.jpg"
              alt="Nam - Expert AI Trainer and AI Engineer based in Da Nang, Vietnam"
            />
          </div>
          <div className="card about-copy">
            <p className="eyebrow">Nice to meet you</p>
            <h2>
              I&apos;m Nam, an AI engineer focused on building AI systems that
              are
              <span> useful, reliable and built for real work.</span>
            </h2>
            <p>
              I explore LLMs, AI Agents and backend systems to turn AI
              capabilities into practical products. I care about making AI not
              only work, but work reliably, safely and with measurable value.
            </p>
            <div className="about-copy__meta">
              <span>Based in Da Nang, Vietnam</span>
              <span>Working worldwide</span>
              <span>Available Q2 2025</span>
            </div>
          </div>
        </section>

        <section className="panel panel--testimonials" id="testimonials">
          <div className="testimonials-heading">
            <p className="eyebrow">Client Feedback</p>
            <h2>
              What people
              <br />
              <span>are saying.</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <TestimonialCard key={idx} testimonial={t} />
            ))}
          </div>
        </section>

        <section className="panel panel--contact" id="contact">
          <div className="contact-card">
            <p className="eyebrow">Start a conversation</p>
            <h2>
              Have a good idea?
              <br />
              <span>Let&apos;s make it real.</span>
            </h2>
            <a href="mailto:tphn26.work@gmail.com">tphn26.work@gmail.com</a>
            <div className="contact-card__footer">
              <span>Da Nang City </span>
              <div>
                <a href="tel:0859215285">0859215285</a>
                <a
                  href="https://www.linkedin.com/in/tphn26"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/tetsde"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://www.facebook.com/tetsdee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  href="https://tphn26.notion.site/A-work-in-progress-dc2590f7e19e83f499150179dedb4837?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Notion
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Apple Dynamic Island / Floating Slide Dock */}
      <SlideDock activeId={activeSection} onNavigate={scrollToSection} />

      {/* Vercel Web Analytics */}
      <Analytics />
    </main>
  )
}
