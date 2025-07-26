const Logo = ({ width = 40, height = 40, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4F46E5", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#7C3AED", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#A855F7", stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="logo-gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#1E40AF", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#3B82F6", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#6366F1", stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#logo-gradient1)" strokeWidth="4"/>
      
      {/* T2 integrated design */}
      {/* T shape */}
      <path d="M25 25 L75 25 L75 35 L60 35 L60 75 L50 75 L50 35 L25 35 Z" fill="url(#logo-gradient2)"/>
      
      {/* 2 shape */}
      <path d="M30 45 Q30 40 35 40 L65 40 Q70 40 70 45 Q70 50 65 50 L40 50 L70 75 L30 75 Z" fill="url(#logo-gradient1)"/>
      
      {/* C arc */}
      <path d="M75 30 Q85 30 85 40 L85 60 Q85 70 75 70" fill="none" stroke="url(#logo-gradient1)" strokeWidth="6" strokeLinecap="round"/>
      
      {/* Decorative elements */}
      <circle cx="20" cy="20" r="3" fill="url(#logo-gradient1)" opacity="0.7"/>
      <circle cx="80" cy="80" r="3" fill="url(#logo-gradient2)" opacity="0.7"/>
      <circle cx="85" cy="15" r="2" fill="url(#logo-gradient1)" opacity="0.5"/>
    </svg>
  );
};

export default Logo;