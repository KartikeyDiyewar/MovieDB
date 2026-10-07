const AiSparkIcon = ({ size = 16, className = "ai-icon-svg" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Primary 4-point curved AI star */}
      <path
        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
        fill="currentColor"
      />
      {/* Secondary accent spark */}
      <path
        d="M19 2C19 3.933 17.433 5.5 15.5 5.5C17.433 5.5 19 7.067 19 9C19 7.067 20.567 5.5 22.5 5.5C20.567 5.5 19 3.933 19 2Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
};

export default AiSparkIcon;
