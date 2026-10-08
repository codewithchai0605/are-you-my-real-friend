/**
 * Two original, simple mascots drawn in SVG (no image files to load).
 * `Bear` = brown, `Panda` = black & white. Decorative → aria-hidden by default.
 */
type MascotProps = { className?: string; mood?: "happy" | "wink" | "smirk" };

const INK = "#4a2f27";

function Mouth({ mood }: { mood: NonNullable<MascotProps["mood"]> }) {
  if (mood === "smirk") {
    return <path d="M89 139 Q100 141 110 135" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />;
  }
  return <path d="M88 134 Q100 148 112 134" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />;
}

export function Bear({ className, mood = "happy" }: MascotProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true" focusable="false">
      {/* body */}
      <ellipse cx="100" cy="182" rx="52" ry="38" fill="#d99a6c" stroke={INK} strokeWidth="5" />
      <ellipse cx="100" cy="188" rx="30" ry="22" fill="#f3d3b0" />
      {/* ears */}
      <circle cx="46" cy="52" r="27" fill="#d99a6c" stroke={INK} strokeWidth="5" />
      <circle cx="154" cy="52" r="27" fill="#d99a6c" stroke={INK} strokeWidth="5" />
      <circle cx="46" cy="52" r="13" fill="#f0b98f" />
      <circle cx="154" cy="52" r="13" fill="#f0b98f" />
      {/* head */}
      <ellipse cx="100" cy="106" rx="76" ry="68" fill="#d99a6c" stroke={INK} strokeWidth="5" />
      {/* cheeks */}
      <ellipse cx="52" cy="124" rx="15" ry="11" fill="#ffb199" opacity="0.8" />
      <ellipse cx="148" cy="124" rx="15" ry="11" fill="#ffb199" opacity="0.8" />
      {/* muzzle */}
      <ellipse cx="100" cy="128" rx="32" ry="24" fill="#f3d3b0" />
      {/* eyes */}
      <circle cx="68" cy="102" r="7" fill={INK} />
      {mood === "wink" ? (
        <path d="M122 102 Q132 94 142 102" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      ) : (
        <circle cx="132" cy="102" r="7" fill={INK} />
      )}
      <circle cx="70" cy="99" r="2.4" fill="#fff" />
      {mood !== "wink" && <circle cx="134" cy="99" r="2.4" fill="#fff" />}
      {/* nose + mouth */}
      <ellipse cx="100" cy="120" rx="9" ry="6.5" fill={INK} />
      <Mouth mood={mood} />
    </svg>
  );
}

export function Panda({ className, mood = "happy" }: MascotProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true" focusable="false">
      {/* body */}
      <ellipse cx="100" cy="182" rx="52" ry="38" fill="#fff" stroke={INK} strokeWidth="5" />
      <ellipse cx="100" cy="196" rx="30" ry="14" fill="#4a2f27" opacity="0.9" />
      {/* ears */}
      <circle cx="46" cy="52" r="27" fill={INK} />
      <circle cx="154" cy="52" r="27" fill={INK} />
      {/* head */}
      <ellipse cx="100" cy="106" rx="76" ry="68" fill="#fff" stroke={INK} strokeWidth="5" />
      {/* eye patches */}
      <ellipse cx="68" cy="104" rx="17" ry="21" fill={INK} transform="rotate(18 68 104)" />
      <ellipse cx="132" cy="104" rx="17" ry="21" fill={INK} transform="rotate(-18 132 104)" />
      {/* eyes */}
      <circle cx="68" cy="102" r="6.5" fill="#fff" />
      {mood === "wink" ? (
        <path d="M122 102 Q132 94 142 102" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      ) : (
        <circle cx="132" cy="102" r="6.5" fill="#fff" />
      )}
      <circle cx="69" cy="102" r="3" fill={INK} />
      {mood !== "wink" && <circle cx="133" cy="102" r="3" fill={INK} />}
      {/* cheeks */}
      <ellipse cx="46" cy="130" rx="15" ry="11" fill="#ffb3c7" opacity="0.85" />
      <ellipse cx="154" cy="130" rx="15" ry="11" fill="#ffb3c7" opacity="0.85" />
      {/* nose + mouth */}
      <ellipse cx="100" cy="124" rx="9" ry="6.5" fill={INK} />
      <Mouth mood={mood} />
    </svg>
  );
}
