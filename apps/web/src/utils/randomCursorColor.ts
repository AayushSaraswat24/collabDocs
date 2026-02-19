export function getRandomColor() {
  const colors = [
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#a78bfa",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}