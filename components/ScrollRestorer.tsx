"use client"

import { useEffect } from "react"

export default function ScrollRestorer() {
  useEffect(() => {
    const y = sessionStorage.getItem("grid-scroll")
    if (y) {
      window.scrollTo({ top: parseInt(y), behavior: "instant" })
      sessionStorage.removeItem("grid-scroll")
    }
  }, [])

  return null
}
