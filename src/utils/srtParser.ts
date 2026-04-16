export const parseSRT = (srtText: string) => {
  const entries = srtText.split('\n\n');
  return entries
    .map((entry) => {
      const lines = entry.trim().split('\n');
      if (lines.length >= 3) {
        const [startTimeRaw, endTimeRaw] = lines[1].split(' --> ');
        const toSeconds = (timeStr: string) => {
          const match = /(\d+):(\d+):(\d+),(\d+)/.exec(timeStr);
          if (!match) return 0;
          const [, hh, mm, ss, ms] = match;
          return parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss) + parseInt(ms) / 1000;
        };
        return {
          start: toSeconds(startTimeRaw),
          end: toSeconds(endTimeRaw),
          text: lines.slice(2).join('\n')
        };
      }
    })
    .filter(Boolean) as { start: number; end: number; text: string }[];
};
