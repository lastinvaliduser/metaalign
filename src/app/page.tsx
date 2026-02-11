import { Suspense } from "react";
import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AnalysisDashboard />
        </Suspense>
    );
}
