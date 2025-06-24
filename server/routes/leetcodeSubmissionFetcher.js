const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const PlatformSubmission = require("../models/platformSubmission");

const router = express.Router();

// Map full language string to Track2Crack style
function mapLeetCodeLang(langStr) {
  langStr = langStr.toLowerCase();
  if (langStr.includes("cpp")) return "cpp";
  if (langStr.includes("java")) return "java";
  if (langStr.includes("python")) return "python";
  return "cpp"; // fallback
}

// Convert status code to status string
function mapStatus(code) {
  const statusMap = {
    10: "Accepted",
    11: "Wrong Answer",
    12: "Memory Limit Exceeded",
    13: "Output Limit Exceeded",
    14: "Time Limit Exceeded",
    15: "Runtime Error",
    20: "Compilation Error",
  };
  return statusMap[code] || "Unknown";
}

// Fetch topic tags for a problem by titleSlug
async function fetchTagsForSlug(slug) {
  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      operationName: "getQuestionDetail",
      variables: { titleSlug: slug },
      query: `
        query getQuestionDetail($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            topicTags {
              name
            }
          }
        }
      `
    });

    const tags = res.data.data.question.topicTags.map(tag => tag.name);
    return tags;
  } catch (error) {
    console.error(`❌ Failed to fetch tags for ${slug}`);
    return []; // fallback
  }
}

// Main route
router.get("/:leetcodeUsername/:userId", async (req, res) => {
  const { leetcodeUsername, userId } = req.params;

  try {
    const gqlResponse = await axios.post("https://leetcode.com/graphql", {
      operationName: "recentSubmissions",
      variables: { username: leetcodeUsername },
      query: `
        query recentSubmissions($username: String!) {
          recentSubmissionList(username: $username) {
            title
            titleSlug
            status
            timestamp
            lang
          }
        }
      `
    });

    const submissions = gqlResponse.data.data.recentSubmissionList;

    // Process each submission
    const submissionDocs = await Promise.all(submissions.map(async (sub) => {
      const tags = await fetchTagsForSlug(sub.titleSlug);

      return {
        user_id: new mongoose.Types.ObjectId(userId),
        platform: "leetcode",
        platform_question_id: sub.titleSlug,
        status: mapStatus(sub.status),
        submitted_at: new Date(parseInt(sub.timestamp) * 1000),
        language: mapLeetCodeLang(sub.lang),
        tags
      };
    }));

    // Save all to DB
    await PlatformSubmission.insertMany(submissionDocs);
    res.status(200).json({ message: "✅ Submissions synced with tags", count: submissionDocs.length });

  } catch (error) {
    console.error("❌ Final error:", error.message);
    res.status(500).json({ error: "Failed to fetch or save LeetCode submissions" });
  }
});

module.exports = router;
