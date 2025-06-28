const axios = require('axios');
const cheerio = require('cheerio');

async function fetchMCQsFromGFG(topicTitle) {
  const topicSlug = topicTitle.toLowerCase().replace(/\s+/g, '-');
  const url = `https://www.geeksforgeeks.org/${topicSlug}-mcq/`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const mcqs = [];

    $('p').each((_, el) => {
      const text = $(el).text().trim();

      if (/^\d+\./.test(text)) {
        const question = text.replace(/^\d+\.\s*/, '');
        const options = [];
        let i = 1;
        while (i <= 4) {
          const optionLine = $(el).nextAll().eq(i - 1).text().trim();
          if (/^(A\.|B\.|C\.|D\.)/.test(optionLine)) {
            options.push(optionLine.replace(/^[A-D]\.\s*/, ''));
            i++;
          } else {
            break;
          }
        }

        if (options.length === 4) {
          mcqs.push({
            questionText: question,
            options,
            correctAnswerIndex: 0 // static for now
          });
        }
      }
    });

    return mcqs;
  } catch (err) {
    console.error(`❌ Error fetching from GFG: ${url}`, err.message);
    return [];
  }
}

module.exports = { fetchMCQsFromGFG };
