import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

                <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p>
                        At MetaAlign, we take your privacy seriously. This Privacy Policy explains how we collect,
                        use, and protect your information when you use our service.
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>
                        <strong>Usage Data:</strong> We may collect non-personal information about how you interact
                        with our website, such as pages visited and time spent.
                        <br />
                        <strong>Input Data:</strong> URLs you submit for analysis are processed to generate the report.
                        We do not store the content of the pages you analyze permanently, although we may cache results
                        temporarily to improve performance.
                    </p>

                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Provide and maintain the MetaAlign service.</li>
                        <li>Improve and optimize our tool based on usage patterns.</li>
                        <li>Detect and prevent technical issues or abuse.</li>
                    </ul>

                    <h3>3. Data Storage</h3>
                    <p>
                        We use local storage on your device to save your search history for your convenience.
                        This data remains on your device and is not synchronized to our servers unless you
                        explicitly use our optional cloud synchronization features (if available).
                    </p>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We may use third-party services for hosting, analytics, and authentication.
                        These providers have access to your information only to perform tasks on our behalf
                        and are obligated not to disclose or use it for any other purpose.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@metaalign.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
