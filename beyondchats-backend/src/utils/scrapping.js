const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
require('dotenv').config();

const cleanForLLM = (text) => {
    let cleaned = text
        // 1. Remove HTML noise first
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<iframe\b[^<]*>/gi, '')

        // 2. Remove navigation/CTA noise
        .replace(/\b(Arrow Left|Arrow Right|back to all posts|Latest Blog Posts|Contact Us|Subscribe|Share|Related Posts|Recommended|Footer|Navigation|Menu|Sidebar)\b/gi, '')
        .replace(/\b(Download|Sign up|Newsletter|Login|Register|Follow us|Share this|Read more|Continue reading|Tell Us More)\b/gi, '')

        // 3. Remove dates/social/URLs
        .replace(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+ \d{1,2}, \d{4})/gi, '')
        .replace(/@[a-zA-Z0-9_]+|https?:\/\/\S+/gi, '')

        // 4. Normalize
        .replace(/\s+/g, ' ').trim();

    // 5. Filter short sentences + dedupe
    const sentences = cleaned.split('.');
    const uniqueSentences = [];
    const seen = new Set();

    for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (trimmed.length > 30 && !/^\s*[A-Z][a-z]{1,10}\s*$/.test(trimmed)) {
            const normalized = trimmed.toLowerCase();
            if (!seen.has(normalized)) {
                uniqueSentences.push(trimmed);
                seen.add(normalized);
            }
        }
    }

    return uniqueSentences.join('. ').substring(0, 7500); // LLM safe
};

const isReadableContent = (text) => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    return words > 150 && sentences > 8 && text.length > 800 &&
        !/login|subscribe|paywall|404|error/i.test(text.toLowerCase());
};

const extractArticleText = ($) => {
    const candidates = [
        "article",
        "main article",
        "main",
        "[role='main']",
        ".post-content",
        ".entry-content",
        ".article-content",
        ".articleBody",
        ".post-body",
        ".post-body-copy",
        ".content__article-body",
        "#content",
        ".blog-post",
        ".single-post",
        "[class*='article'] [class*='content']",
        ".post-content",
    ];

    for (const sel of candidates) {
        const el = $(sel);
        if (el.length) {
            let text = el.text().replace(/\s+/g, " ").trim();
            if (text.length > 300 && isReadableContent(text)) {
                return cleanForLLM(text);
            }
        }
    }

    // Fallback with aggressive cleaning
    const fallback = cleanForLLM($("body").text());
    return isReadableContent(fallback) ? fallback : "No readable content found";
};

const getGoogleLinks = async (query) => {
    try {
        const response = await axios.post(
            "https://google.serper.dev/search",
            {
                q: query,
                gl: "in",
                num: 10, // Get more for better filtering
            },
            {
                headers: {
                    "X-API-KEY": process.env.SERPER_API_KEY,
                    "Content-Type": "application/json",
                },
                maxBodyLength: Infinity,
            }
        );

        const organicResults = response.data.organic || [];
        console.log("Google Links fetched:", organicResults.length);

        const ignoredLinks = [
            "beyondchats.com",
            "facebook.com",
            "reddit.com",
            "quora.com",
            "twitter.com",
            "linkedin.com",
            "youtube.com",
            "wikipedia.org", // Often too generic
        ];

        const data = organicResults
            .filter(item =>
                item.title &&
                item.link &&
                item.link.startsWith('http') &&
                !ignoredLinks.some(link => item.link.includes(link)) &&
                !item.link.includes('?utm_') // No tracking links
            )
            .map(item => item.link)
            .slice(0, 3); // Return up to 3 good ones

        console.log("Filtered links:", data.length);
        return data.length > 0 ? data.slice(0, 2) : [];
    } catch (error) {
        console.error("Serper API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch Google search results");
    }
};

const getScrappedData = async (links) => {
    try {
        const urls = Array.isArray(links) ? links : [links].filter(Boolean);

        if (urls.length === 0) {
            throw new Error("No valid URLs provided");
        }

        console.log("Scraping URLs:", urls);

        const responses = await Promise.all(
            urls.map(url =>
                axios.get(url, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                            '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept':
                            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,' +
                            'image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': 'https://www.google.com/',
                        'Connection': 'keep-alive',
                    }
                })
            )
        );

        const results = [];

        for (const res of responses) {
            try {
                const $ = cheerio.load(res.data);

                const title =
                    $("meta[property='og:title']").attr("content") ||
                    $("meta[name='twitter:title']").attr("content") ||
                    $("h1").first().text().trim() ||
                    $("title").text().trim();

                const content = extractArticleText($);



                results.push({
                    url: res.config.url,
                    title: title.substring(0, 200), 
                    content,
                    wordCount: content.split(/\s+/).length,
                    isValid: isReadableContent(content)
                });

            } catch (docError) {
                console.warn(`Failed to parse ${res.config.url}:`, docError.message);
            }
        }

        console.log(`Scraped ${results.length} valid articles:`,
            results.map(r => ({ title: r.title, words: r.wordCount })));

        // Return cleaned concatenated content for LLM
        const validContents = results
            .filter(r => r.isValid)
            .map(r => `--- ${r.title} ---\n${r.content}`)
            .join('\n\n');

        return validContents || "No valid article content found";

    } catch (error) {
        console.error("Error fetching scrapped data:", error.message);
        throw new Error(`Scraping failed: ${error.message}`);
    }
};

const updateContent = async (content, title) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: content,
        config: {
            systemInstruction: ` You are an expert content writer.
Rewrite the provided article by enhancing its formatting, clarity, and depth.
Ensure the rewritten article maintains originality while citing the reference articles used.
Your output should be well-structured, engaging, and informative. In case you do not have enough information to write a full article, then use the title to create a relevant article. this is the title: ${title}.
Format the article using appropriate headings, subheadings, bullet points, and paragraphs where necessary.
return an Html with proper tags starting from the div tag <div class="article-content">
`,
        },
    });
    console.log(response.text);
    return response.text;
}

module.exports = { getGoogleLinks, getScrappedData, updateContent };
