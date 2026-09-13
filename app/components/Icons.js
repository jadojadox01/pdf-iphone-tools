export function Icon({ name, size = 24, className }) {
  const Glyph = ICONS[name] || ICONS.file;
  const filled = name === "facebook" || name === "linkedin" || name === "x" || name === "whatsapp";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    >
      <Glyph />
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ICONS() {}

ICONS.word = function Word() {
  return (
    <>
      <path d="M7 3.5h7.2L19 8.2V20.5H7V3.5z" {...stroke} />
      <path d="M14.1 3.5V8.3H19" {...stroke} />
      <path d="M9.2 16.2l1.4-5.2 1.3 3.6 1.3-3.6 1.4 5.2" {...stroke} />
    </>
  );
};

ICONS.image = function Image() {
  return (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" {...stroke} />
      <circle cx="9" cy="10" r="1.4" fill="currentColor" />
      <path d="M4.8 16.5l4.4-4.2 3.2 3 3.1-2.6 4.3 3.8" {...stroke} />
    </>
  );
};

ICONS.excel = function Excel() {
  return (
    <>
      <rect x="4" y="4.5" width="16" height="15" rx="2" {...stroke} />
      <path d="M4 9.5h16M4 14.5h16M10 4.5v15" {...stroke} />
    </>
  );
};

ICONS.ppt = function Ppt() {
  return (
    <>
      <rect x="3.5" y="5.5" width="17" height="12" rx="2" {...stroke} />
      <path d="M12 17.5v2.2M8.5 19.7h7" {...stroke} />
      <path d="M8 10.2h3.2a1.8 1.8 0 010 3.6H8V8.8" {...stroke} />
    </>
  );
};

ICONS.ebook = function Ebook() {
  return (
    <>
      <path d="M5 5.5h5.2a3.3 3.3 0 013.3 3.3v10.2A3.3 3.3 0 0010.2 16H5V5.5z" {...stroke} />
      <path d="M19 5.5h-5.2A3.3 3.3 0 0010.5 8.8v10.2A3.3 3.3 0 0113.8 16H19V5.5z" {...stroke} />
    </>
  );
};

ICONS.merge = function Merge() {
  return (
    <>
      <rect x="3.5" y="4.5" width="9" height="12" rx="1.5" {...stroke} />
      <rect x="11.5" y="7.5" width="9" height="12" rx="1.5" {...stroke} />
    </>
  );
};

ICONS.split = function Split() {
  return (
    <>
      <path d="M12 4.5v15" {...stroke} />
      <path d="M8 8.5L4.5 12 8 15.5M16 8.5L19.5 12 16 15.5" {...stroke} />
    </>
  );
};

ICONS.compress = function Compress() {
  return (
    <>
      <path d="M8 4.5H4.5V8M16 4.5h3.5V8M8 19.5H4.5V16M16 19.5h3.5V16" {...stroke} />
      <path d="M9 9l3 3 3-3M9 15l3-3 3 3" {...stroke} />
    </>
  );
};

ICONS.rotate = function Rotate() {
  return (
    <>
      <path d="M4.8 12a7.2 7.2 0 101.7-4.7" {...stroke} />
      <path d="M4.5 5.2v4.2H8.7" {...stroke} />
    </>
  );
};

ICONS.sign = function Sign() {
  return (
    <>
      <path d="M4.5 19.5h15" {...stroke} />
      <path d="M14.8 5.2l4 4-8.3 8.3H6.5v-4L14.8 5.2z" {...stroke} />
    </>
  );
};

ICONS.protect = function Protect() {
  return (
    <>
      <rect x="6.5" y="10.5" width="11" height="8.5" rx="1.6" {...stroke} />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 017 0v2.3" {...stroke} />
    </>
  );
};

ICONS.unlock = function Unlock() {
  return (
    <>
      <rect x="6.5" y="10.5" width="11" height="8.5" rx="1.6" {...stroke} />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 016.6-1.6" {...stroke} />
    </>
  );
};

ICONS.file = function File() {
  return (
    <>
      <path d="M7 3.8h7.3L19 8.4V20.2H7V3.8z" {...stroke} />
      <path d="M14.2 3.8v4.7H19" {...stroke} />
    </>
  );
};

ICONS.iphone = function Iphone() {
  return (
    <>
      <rect x="7.5" y="3.2" width="9" height="17.6" rx="2.2" {...stroke} />
      <path d="M10.5 5.2h3" {...stroke} />
      <circle cx="12" cy="17.8" r="0.7" fill="currentColor" />
    </>
  );
};

ICONS.mac = function Mac() {
  return (
    <>
      <rect x="3.5" y="5" width="17" height="11.5" rx="1.6" {...stroke} />
      <path d="M8 19.2h8M12 16.5v2.7" {...stroke} />
    </>
  );
};

ICONS.android = function Android() {
  return (
    <>
      <rect x="7" y="8.2" width="10" height="10.5" rx="2" {...stroke} />
      <path d="M9.2 8.2V5.8M14.8 8.2V5.8M7 12.2H4.8M19.2 12.2H17" {...stroke} />
      <circle cx="10.2" cy="12.2" r="0.7" fill="currentColor" />
      <circle cx="13.8" cy="12.2" r="0.7" fill="currentColor" />
    </>
  );
};

ICONS.windows = function Windows() {
  return (
    <>
      <path d="M4.5 6.2h6.6v6.6H4.5zM12.9 6.2h6.6v6.6h-6.6zM4.5 14.6h6.6v6.6H4.5zM12.9 14.6h6.6v6.6h-6.6z" {...stroke} />
    </>
  );
};

ICONS.check = function Check() {
  return <path d="M5 12.2l4.2 4.1L19 7.8" {...stroke} />;
};

ICONS.shield = function Shield() {
  return <path d="M12 3.5l7.5 3v6.2c0 4.4-3 7.3-7.5 8.8-4.5-1.5-7.5-4.4-7.5-8.8V6.5l7.5-3z" {...stroke} />;
};

ICONS.download = function Download() {
  return (
    <>
      <path d="M12 4.5v10.2M8.2 11.2L12 15l3.8-3.8" {...stroke} />
      <path d="M5 19.2h14" {...stroke} />
    </>
  );
};

ICONS.open = function Open() {
  return (
    <>
      <rect x="4.5" y="5" width="15" height="14" rx="2" {...stroke} />
      <path d="M8 12h8M12 8v8" {...stroke} />
    </>
  );
};

ICONS.guide = function Guide() {
  return (
    <>
      <path d="M6 4.8h9.5a2.5 2.5 0 012.5 2.5V19H8.2A2.2 2.2 0 016 16.8V4.8z" {...stroke} />
      <path d="M6 16.8h10" {...stroke} />
    </>
  );
};

ICONS.chevron = function Chevron() {
  return <path d="M6.5 9.2L12 14.6l5.5-5.4" {...stroke} />;
};

ICONS.clock = function Clock() {
  return (
    <>
      <circle cx="12" cy="12" r="8.2" {...stroke} />
      <path d="M12 7.8V12l3 2" {...stroke} />
    </>
  );
};

ICONS.eye = function Eye() {
  return (
    <>
      <path d="M3.6 12s3.2-5.4 8.4-5.4S20.4 12 20.4 12s-3.2 5.4-8.4 5.4S3.6 12 3.6 12z" {...stroke} />
      <circle cx="12" cy="12" r="2.2" {...stroke} />
    </>
  );
};

ICONS.facebook = function Facebook() {
  return <path fill="currentColor" d="M14.2 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.5v2.8h2.5V21h3z" />;
};

ICONS.linkedin = function Linkedin() {
  return (
    <path
      fill="currentColor"
      d="M6.1 9.3H3.4V20.7h2.7V9.3zM4.7 3.3A1.6 1.6 0 103.1 4.9a1.6 1.6 0 001.6-1.6zM20.6 20.7h-2.7v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H11.3V9.3h2.6v1.6h.1a2.8 2.8 0 012.5-1.8c2.7 0 3.2 1.8 3.2 4.1v7.5z"
    />
  );
};

ICONS.x = function X() {
  return (
    <path
      fill="currentColor"
      d="M17.7 3.5h2.6l-5.7 6.5 6.7 8.5h-5.3l-4.1-5.4-4.7 5.4H4.6l6.1-7L4.2 3.5h5.4l3.8 5 4.3-5zm-.9 13.5h1.4L7.3 4.9H5.8l11 12.1z"
    />
  );
};

ICONS.whatsapp = function Whatsapp() {
  return (
    <path
      fill="currentColor"
      d="M12.04 3.5A8.45 8.45 0 003.5 11.9c0 1.49.39 2.94 1.13 4.22L3.5 20.5l4.5-1.17a8.5 8.5 0 004.04.97h.01A8.45 8.45 0 0020.5 11.9 8.45 8.45 0 0012.04 3.5zm4.86 11.96c-.2.56-1.16 1.07-1.62 1.14-.41.06-.93.09-1.5-.09-.35-.11-.79-.26-1.36-.51-2.4-1.04-3.96-3.46-4.08-3.62-.12-.17-1-1.33-1-2.54s.63-1.8.86-2.05c.2-.22.53-.33.86-.33h.26c.2 0 .4 0 .57.44.2.52.67 1.8.73 1.93.06.13.1.28.02.45-.08.17-.12.28-.24.43-.12.15-.25.33-.36.45-.12.13-.24.26-.1.5.13.24.6 1 .1.28 1.71 1.4 2.02 1.52 2.3 1.69.28.17.45.14.62-.08.17-.22.73-.85.93-1.14.2-.28.39-.24.65-.14.26.1 1.67.79 1.96.93.28.14.47.21.54.33.07.13.07.73-.13 1.29z"
    />
  );
};
