export const STARTERS = [
  {
    id: 'plot-twist',
    title: 'Plot twist',
    description: 'For the moment your story turns.',
    settings: {
      text: 'A little plot twist', focus: 2, seed: 42, ratio: '9:16', format: 'mp4',
      duration: 3, cps: 12, zoom: 1.5, blur: 1, style: 'newsprint', highlight: '#ffd23f', sound: 'paper',
    },
  },
  {
    id: 'after-hours',
    title: 'After hours',
    description: 'A slower cut with darker pages.',
    settings: {
      text: 'Turn the noise down', focus: 2, seed: 223, ratio: '1:1', format: 'mp4',
      duration: 3, cps: 6, zoom: 1.3, blur: 0.6, style: 'mixed', highlight: '#ff4f9a', sound: 'film',
    },
  },
  {
    id: 'next-move',
    title: 'Next move',
    description: 'A wide opener for your next edit.',
    settings: {
      text: 'Make the next move', focus: 2, seed: 918, ratio: '16:9', format: 'mp4',
      duration: 3, cps: 10, zoom: 1.4, blur: 0.8, style: 'newsprint', highlight: '#ffd23f', sound: 'shutter',
    },
  },
].map((starter) => ({
  ...starter,
  poster: `assets/starter-${starter.id}.webp`,
  video: `assets/starter-${starter.id}.mp4`,
  href: `editor.html#${new URLSearchParams(starter.settings)}`,
}));
