import React from 'react'

// Wordmark for the app. The mark is a rounded square with the F knocked out
// of it (fill-rule evenodd), so the counter shows whatever surface sits
// behind it and the whole lockup works on light and dark without a second
// asset. Fill is currentColor, so it follows the surrounding text colour.
const Logo = ({className = '', markClass = 'h-7 w-7', textClass = 'text-[17px]'}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <svg viewBox='0 0 32 32' className={`${markClass} shrink-0`} aria-hidden='true' focusable='false'>
      <path fill='currentColor' fillRule='evenodd' clipRule='evenodd'
      d='M8 0h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8Zm3 8.5h10.5v3.4h-6.9v3.1h5.6v3.4h-5.6v5.1H11V8.5Z'/>
    </svg>
    <span className={`${textClass} font-semibold tracking-tight`}>Finn</span>
  </span>
)

export default Logo
