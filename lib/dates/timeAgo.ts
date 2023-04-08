import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// Get a Date object representing 3 days ago
// const threeDaysAgo = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000));

// Get a human-readable string representing the time elapsed since threeDaysAgo
export const timeAgo = (date: Date) => dayjs(date).fromNow();
