import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Analyzer
                </Link>

                <h1 className="text-3xl font-bold tracking-tight">About MetaAlign</h1>

                <section className="space-y-4 text-muted-foreground">
                    <p>
                        Welcome to **MetaAlign**, your go-to solution for automated technical SEO analysis.
                        Our mission is to democratize high-quality SEO by providing developers and content creators
                        with instant, actionable feedback on their meta tags and structured data.
                    </p>
                    <p>
                        In the fast-paced world of digital marketing, ensuring your content is discoverable
                        is paramount. MetaAlign leverages advanced parsing logic and AI-driven insights to
                        help you align your metadata with search engine best practices.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Our Expertise</h2>
                    <p className="text-muted-foreground">
                        Built by a team of passionate web performance engineers, MetaAlign is designed
                        to catch the subtle errors that often go unnoticed but significantly impact
                        your click-through rates and search rankings.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
                    <p className="text-muted-foreground">
                        Have questions, suggestions, or need support? Reach out to us at:
                        <br />
                        <a href="mailto:support@metaalign.com" className="text-primary hover:underline">
                            support@metaalign.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
