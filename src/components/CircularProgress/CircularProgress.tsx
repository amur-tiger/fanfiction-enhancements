import "./CircularProgress.css";

export interface CircularProgressProps {
  progress?: number;
  size?: number;
}

export default function CircularProgress({ progress, size = 24 }: CircularProgressProps) {
  const strokeWidth = 4;

  const circumference = (size - strokeWidth) * Math.PI;
  const dash = (progress ?? 0) * circumference;

  return (
    <span style={`height: ${size}px;`}>
      <progress class="ffe-cp-progress" value={progress} />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          class="ffe-cp-circle-background"
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke-width={strokeWidth}
        />
        <circle
          class="ffe-cp-circle-foreground"
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke-width={strokeWidth}
          stroke-dasharray={`${dash} ${circumference - dash}`}
          style={`transform-origin: ${size / 2} ${size / 2}`}
        />
      </svg>
    </span>
  );
}
