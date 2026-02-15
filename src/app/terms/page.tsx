import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Analyzer
                </Link>

                <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
                <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using MetaAlign, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our service.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        MetaAlign provides tools for analyzing and optimizing website meta tags and SEO performance.
                        The service is provided &quot;as is&quot; and we make no guarantees regarding the accuracy or
                        completeness of the analysis.
                    </p>

                    <h3>3. User Responsibilities</h3>
                    <p>
                        You agree to use MetaAlign only for lawful purposes. You represent that you have the right
                        to analyze the URLs you submit or that they are publicly accessible. You must not use
                        our service to harass, harm, or attempt to compromise the security of any website.
                    </p>

                    <h3>4. Intellectual Property</h3>
                    <p>
                        The MetaAlign service, including its code, design, and branding, is protected by copyright
                        and other intellectual property laws. You may not copy, modify, or distribute our content
                        without our prior written consent.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        In no event shall MetaAlign be liable for any indirect, incidental, special, consequential,
                        or punitive damages arising out of or related to your use of the service.
                    </p>

                    <h3>6. Changes to Terms</h3>
                    <p>
                        We reserve the right to modify these terms at any time. We will provide notice of significant
                        changes by updating the &quot;Last Updated&quot; date at the top of this page. Your continued use of
                        the service after any such changes constitutes your acceptance of the new terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
