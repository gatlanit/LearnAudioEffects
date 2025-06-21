export const chapters = [
  { path: "", title: "Get started", color: "#1976d2" },
  { path: "gain", title: "Gain", color: "#ec195b" },
  { path: "delay", title: "Delay/Echo", color: "#a442f5" },
  { path: "reverb", title: "Reverb", color: "#85eb00" },
  { path: "saturation", title: "Saturation", color: "#c2185b" },
  { path: "filters-eq", title: "Filters & EQ", color: "#0288d1" },
  { path: "beyond", title: "Beyond", color: "#c2185b" },
];

// Quick lookup by path for use in Header Chapter Title
export const chaptersMap = chapters.reduce((acc, chapter) => {
  acc[chapter.path] = chapter;
  return acc;
}, {});