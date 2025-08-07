
// Global keyword color mapping to ensure consistency across all cards
const PASTEL_COLORS = [
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-lime-100 text-lime-700 border-lime-200',
  'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'bg-slate-100 text-slate-700 border-slate-200',
  'bg-zinc-100 text-zinc-700 border-zinc-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-stone-100 text-stone-700 border-stone-200',
  'bg-neutral-100 text-neutral-700 border-neutral-200',
  'bg-gray-100 text-gray-700 border-gray-200',
  'bg-pink-50 text-pink-600 border-pink-300',
  'bg-blue-50 text-blue-600 border-blue-300',
  'bg-green-50 text-green-600 border-green-300',
  'bg-purple-50 text-purple-600 border-purple-300',
  'bg-yellow-50 text-yellow-600 border-yellow-300',
  'bg-indigo-50 text-indigo-600 border-indigo-300',
  'bg-orange-50 text-orange-600 border-orange-300',
  'bg-teal-50 text-teal-600 border-teal-300'
];

// Global mapping of keywords to colors
const keywordColorMap = new Map<string, string>();
let colorIndex = 0;

export const getKeywordColor = (keyword: string): string => {
  // If we already have a color for this keyword, return it
  if (keywordColorMap.has(keyword)) {
    return keywordColorMap.get(keyword)!;
  }
  
  // Assign the next available color
  const color = PASTEL_COLORS[colorIndex % PASTEL_COLORS.length];
  keywordColorMap.set(keyword, color);
  colorIndex++;
  
  return color;
};
