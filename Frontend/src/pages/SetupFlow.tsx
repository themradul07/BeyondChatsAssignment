import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getArticlePairs, UpdateAllArticles } from "@/data/mockArticles";
import { Loader2, CheckCircle2, Download, RefreshCw, ArrowRight } from "lucide-react";
import { ArticlesResponse } from "@/types/article";

type FlowStep = "initial" | "fetching" | "fetched" | "updating" | "complete";

const SetupFlow = () => {
  const [step, setStep] = useState<FlowStep>("initial");
  const [articlePairs, setArticlePairs] = useState<number>(0);
  const [articles, setArticles] = useState<ArticlesResponse[]>([]);


  const handleFetchArticles = async () => {
    setStep("fetching");
    const len = await getArticlePairs();
    console.log("Article pairs fetched in SetupFlow:", len);
    if (len < 0) {
      // Handle error case
      setStep("initial");
      return;
    }
    setArticlePairs(len);
    setStep("fetched");

  };

  const handleUpdateArticles = async () => {
    setStep("updating");
    try {
      const updatedArticles = await UpdateAllArticles();
      setArticles(updatedArticles.articles);
      setStep("complete");
      return;
    } catch (err) {
      console.log(err);
      setStep("fetched");
    }

  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <StepIndicator
                step={1}
                label="Fetch"
                active={step === "initial" || step === "fetching"}
                complete={step === "fetched" || step === "updating" || step === "complete"}
              />
              <div className={`h-0.5 w-12 ${step === "fetched" || step === "updating" || step === "complete" ? "bg-primary" : "bg-border"}`} />
              <StepIndicator
                step={2}
                label="Update"
                active={step === "fetched" || step === "updating"}
                complete={step === "complete"}
              />
              <div className={`h-0.5 w-12 ${step === "complete" ? "bg-primary" : "bg-border"}`} />
              <StepIndicator
                step={3}
                label="View"
                active={step === "complete"}
                complete={false}
              />
            </div>

            {/* Step Content */}
            <div className="max-w-2xl mx-auto text-center">
              {step === "initial" && (
                <div className="animate-fade-in">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl gradient-hero flex items-center justify-center shadow-card">
                    <Download className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Fetch Your Articles
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8">
                    Click the button below to fetch all articles from your content source.
                    This will retrieve both original and AI-enhanced versions.
                  </p>
                  <Button variant="hero" size="xl" onClick={handleFetchArticles}>
                    <Download className="mr-2 h-5 w-5" />
                    Fetch All Articles
                  </Button>
                </div>
              )}

              {step === "fetching" && (
                <div className="animate-fade-in">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Fetching Articles...
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8">
                    Please wait while we retrieve your articles from the server.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                </div>
              )}

              {step === "fetched" && (
                <div className="animate-fade-in">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Articles Fetched Successfully!
                  </h1>
                  <p className="text-muted-foreground text-lg mb-4">
                    We found <Badge variant="enhanced">{articlePairs} article pairs</Badge> ready for processing.
                  </p>
                  <p className="text-muted-foreground mb-8">
                    Now let's update all articles to generate AI-enhanced versions.
                  </p>
                  <Button variant="hero" size="xl" onClick={handleUpdateArticles}>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Update All Articles
                  </Button>
                </div>
              )}

              {step === "updating" && (
                <div className="animate-fade-in">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                    <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Updating Articles...
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8">
                    Generating AI-enhanced versions for all articles.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enhancing content...</span>
                  </div>
                </div>
              )}

              {step === "complete" && (
                <div className="animate-fade-in">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    All Done!
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8">
                    Your articles are ready. Browse them below or explore the full collection.
                  </p>
                </div>
              )}
            </div>

            {/* Articles Grid - Only show when complete */}
            {step === "complete" && (
              <div className="mt-16 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Your Articles
                  </h2>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((pair, index) => (
                    <ArticleCard key={index} articlePair={pair} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const StepIndicator = ({
  step,
  label,
  active,
  complete
}: {
  step: number;
  label: string;
  active: boolean;
  complete: boolean;
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${complete
          ? "bg-primary text-primary-foreground"
          : active
            ? "bg-primary/20 text-primary border-2 border-primary"
            : "bg-muted text-muted-foreground"
        }`}
    >
      {complete ? <CheckCircle2 className="h-5 w-5" /> : step}
    </div>
    <span className={`text-xs font-medium ${active || complete ? "text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
  </div>
);

export default SetupFlow;
