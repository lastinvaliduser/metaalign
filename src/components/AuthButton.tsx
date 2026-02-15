"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { UserCircle, LogOut, Mail, Loader2 } from "lucide-react";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}`,
            },
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Check your email for the login link!");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        setLoading(true); // Show loading state immediately to improve UX
        await supabase.auth.signOut();
        // State update via onAuthStateChange will handle user nulling
    };

    if (loading && !user && !isLoginOpen) {
        return (
            <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse" />
        );
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <UserCircle className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">{user.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            {!isLoginOpen ? (
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Login
                </button>
            ) : (
                <div className="absolute right-0 top-12 w-72 p-4 glass rounded-xl border border-border/50 shadow-xl z-50 animate-fade-in-up">
                    <h3 className="text-sm font-semibold mb-3">Login / Sign Up</h3>
                    <form onSubmit={handleLogin} className="space-y-3">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                            Send Magic Link
                        </button>
                        {message && (
                            <p className={`text-xs ${message.includes("Check") ? "text-emerald-400" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginOpen(false);
                                setMessage(null);
                                setEmail("");
                            }}
                            className="w-full text-xs text-muted-foreground hover:text-foreground mt-2"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
