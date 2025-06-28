import * as React from "react"

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="40" height="40" rx="8" fill="white"/>
    <path d="M12 12H18.4C20.9464 12 23 14.0536 23 16.6V16.6C23 19.1464 20.9464 21.2 18.4 21.2H12V12Z" fill="#8A4DFF"/>
    <path d="M28 28H21.6C19.0536 28 17 25.9464 17 23.4V23.4C17 20.8536 19.0536 18.8 21.6 18.8H28V28Z" fill="#8A4DFF"/>
  </svg>
)
