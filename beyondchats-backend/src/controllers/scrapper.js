const { default: axios } = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");
const { getScrappedData, getGoogleLinks, updateContent } = require("../utils/scrapping");

const scrapeWebsite = async (req, res) => {
  try {
    const baseUrl = "https://beyondchats.com/blogs/page/14";
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];


    $("article").each((index, element) => {
      if (index >= 5) return false; // Limit to first 5 articles
      console.log("Scraping article:", index);
      const title = $(element).find(".entry-title").text().trim();
      const link = $(element).find(".entry-title a").attr("href");
      const date = $(element).find(".ct-meta-element-date").text().trim();
      console.log("Found date:", date);
      console.log("Found title:", title);
      if (title) {
        articles.push({ title, date, link });
        Article.create({ title, date, content: "", link, sourceUrl: "", isUpdated: false, references: [] });
      }
    });


    //Scraping the olds content
    for (const article of articles) {
      console.log("Scraping content for article:", article.title);
      const content = await axios.get(article.link);
      const contentHtml = content.data;
      const $$ = cheerio.load(contentHtml);
      const articleContent = $$("#content").html().trim();
      console.log("Scraped content length for", article.title, ":", articleContent.length);
      await Article.updateOne({ title: article.title }, { oldcontent: articleContent });
    }

    res.json({ message: "Scraping completed", length: 5 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during scraping", error: error.message });
  }
};

const updateAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isUpdated: false });
    for (const article of articles) {

      console.log("Updating article:", article.title);
      const referencelinks = await getGoogleLinks(article.title);
      article.content = await getScrappedData(referencelinks);
      try {
        console.log("Generating updated content for article:", article.title);
        // const updatedContent = await updateContent(article.content, article.title);
        const updatedContent = "The consolidated and rewritten content based on the references.";
        article.content = updatedContent;
        article.isUpdated = true;
      } catch (genError) {
        console.error("Error generating updated content:", genError);
      }

      article.references = referencelinks;

      await article.save();
    }
    const resArticles = await Article.find({ isUpdated: true });
    const filteredArticles = resArticles.map((art) => ({
      id: art._id,
      title: art.title,
      content: art.content.slice(0, 200) + "...",
    }));
    return res.json({ message: "Article updated", articles: filteredArticles });
  } catch (error) {
    console.error("Error updating articles:", error);
    res
      .status(500)
      .json({ message: "Error updating articles", error: error.message });
  }
};

module.exports = { scrapeWebsite, updateAllArticles };
