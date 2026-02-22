export function getRandomColor() {
  const colors = [
    "#f87171", 
    "#60a5fa", 
    "#34d399", 
    "#fbbf24", 
    "#a78bfa", 
    "#fb923c",
    "#f472b6", 
    "#38bdf8", 
    "#4ade80",
    "#e879f9", 
    "#facc15",
    "#2dd4bf",
    "#818cf8", 
    "#fb7185",
    "#a3e635", 
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}