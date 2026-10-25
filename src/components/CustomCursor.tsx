import { useEffect, useRef, useState } from "react"
import "../index.css"

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const requestRef = useRef<number | null>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide default cursor on desktop
    document.documentElement.style.cursor = "none"

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)

    // Check hover states for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer")
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    document.addEventListener("mouseover", handleMouseOver)

    const render = () => {
      // Lerp for the ring
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }

      requestRef.current = requestAnimationFrame(render)
    }
    requestRef.current = requestAnimationFrame(render)

    return () => {
      document.documentElement.style.cursor = "auto"
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseover", handleMouseOver)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isVisible])

  // Don't render cursor on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Ring */}
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 rounded-full border border-gray-400 mix-blend-difference transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${
          isHovering ? "w-12 h-12 bg-white/10 backdrop-blur-sm scale-110" : "w-8 h-8 bg-transparent"
        }`}
        style={{ willChange: "transform" }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className={`absolute left-0 top-0 rounded-full bg-white mix-blend-difference transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${
          isHovering ? "w-0 h-0 opacity-0" : "w-2 h-2 opacity-100"
        }`}
        style={{ willChange: "transform" }}
      />
    </div>
  )
}
