const fs = require("fs");

const rawData = require("./raw/striver_raw.json");

function getPlatform(url) {
  if (url.includes("geeksforgeeks")) return "GFG";
  if (url.includes("leetcode")) return "LeetCode";
  if (url.includes("codingninjas")) return "CodeStudio";
  return "Other";
}

function guessDifficulty(title) {
  const lower = title.toLowerCase();
  if (lower.includes("dp") || lower.includes("graph") || lower.includes("interval")) return "Hard";
  if (lower.includes("sort") || lower.includes("search") || lower.includes("kth")) return "Medium";
  return "Easy";
}

const formatted = rawData.map(item => ({
  title: item["Problem: "].trim(),
  link: item["URL"].trim(),
  platform: getPlatform(item["URL"]),
  difficulty: guessDifficulty(item["Problem: "]),
  topic: item["Topic:"].trim()
}));

fs.writeFileSync("./data/dsa.json", JSON.stringify(formatted, null, 2));
console.log("✅ Formatted seed data saved to data/dsa.json");
