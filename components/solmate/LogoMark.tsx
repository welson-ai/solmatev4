'use client'

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      {/* Left parallelogram */}
      <polygon
        points="4,16 10,8 18,8 12,16"
        fill="#00C896"
        opacity="0.9"
      />
      {/* Right parallelogram (offset) */}
      <polygon
        points="14,16 20,8 28,8 22,16"
        fill="#00C896"
        opacity="0.6"
      />
      {/* Bottom accent */}
      <polygon
        points="9,20 15,12 23,12 17,20"
        fill="#00C896"
        opacity="0.3"
      />
    </svg>
  )
}
