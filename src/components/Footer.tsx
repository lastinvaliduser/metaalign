import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border/50 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* About Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            About MetaAlign
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            MetaAlign is a comprehensive SEO and AEO analysis
                            tool that helps you optimize your website for search
                            engines and AI-powered answer engines.
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/docs"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Getting Started
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Best Practices
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:support@metaalign.com"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Support
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://twitter.com/metaalign"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/company/metaalign"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/privacy"
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/terms"
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Built with</span>
                        <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                        <span>by MetaAlign</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} MetaAlign. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
