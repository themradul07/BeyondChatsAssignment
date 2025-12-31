import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ArticleList from "@/components/ArticleList";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ArticleList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
