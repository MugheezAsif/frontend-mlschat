export const getRelativeTime = (date) => {
  const now = new Date();
  const posted = new Date(date);
  const diff = (now - posted) / 1000;

  const times = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (let t of times) {
    const count = Math.floor(diff / t.seconds);
    if (count >= 1) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-count, t.unit);
    }
  }

  return "Just now";
};
