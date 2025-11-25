import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../auth/AuthContext';
import {signInWithPopup} from 'firebase/auth';
import {auth, googleProvider} from '../firebase';
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import {EmptyNavigationBar} from "../components/layout/EmptyNavigationBar.tsx";
import {SocialMediasFooter} from "../components/layout/SocialMediasFooter.tsx";
import {GoogleLogo} from "../components/logos/GoogleLogo.tsx";
import {ErrorLogo} from "../components/logos/ErrorLogo.tsx";
import {NoteLogo} from "../components/logos/NoteLogo.tsx";

export default function AuthPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'register') {
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({email, name, password})
                });
            }
            const res = await apiFetch<{ accessToken: string; user: { id: number; email: string; name: string } }>(
                '/auth/login',
                {method: 'POST', body: JSON.stringify({email, password})}
            );

            login(res.accessToken, res.user);
            navigate('/folders');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (err: Error) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);

            const idToken = await result.user.getIdToken();
            const res = await apiFetch<{ token: string; user: { id: number; email: string; name: string } }>(
                '/auth/firebase-login',
                {
                    method: 'POST',
                    body: JSON.stringify({idToken})
                }
            );

            // FIREBASE TOKEN HERE, NOT JWT
            login(idToken, res.user);
            navigate('/folders');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (err: Error) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled");
            } else {
                setError(err.message);
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{animationDelay: '1s'}}>
                </div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
                     style={{animationDelay: '2s'}}>
                </div>
            </div>

            <EmptyNavigationBar/>

            {/* Main Card */}
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
                <div className="max-w-md w-full">

                    {/* Brand Section */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50">
                            <NoteLogo/>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            LCorpNotes
                        </h1>
                    </div>

                    {/* Auth Card */}
                    <div
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700/50">
                        {/* Header */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {mode === 'login' ? "Welcome Back!" : "Create Account"}
                            </h2>
                            <p className="text-gray-400">
                                {mode === 'login'
                                    ? "Sign in to access your notes"
                                    : "Get started with LCorpNotes"}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                id="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="AngelicaMyWaifu@gmail.com"
                                required
                                className="bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50"
                            />

                            {mode === 'register' && (
                                <Input
                                    id="name"
                                    label="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="Roland"
                                    required
                                    className="bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50"
                                />
                            )}

                            <Input
                                id="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="••••••••"
                                required
                                className="bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40">
                                {mode === 'login' ? "Sign in" : "Create account"}
                            </Button>
                        </form>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="flex items-center gap-2 p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                                <ErrorLogo/>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-gray-800/80 text-gray-400 font-medium">Or continue with other services</span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <GoogleLogo/>
                            {googleLoading ? "Signing in..." : "Continue with Google"}
                        </button>

                        {/* Toggle Mode */}
                        <div className="text-center pt-4 border-t border-gray-700/50">
                            <span className="text-gray-400">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            </span>
                            {' '}
                            <button
                                className="text-indigo-400 font-semibold hover:text-indigo-300 focus:outline-none transition"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                                {mode === 'login' ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>

                    {/* Security Note */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        🔒 Your data is NOT encrypted and NOT secure
                    </p>
                </div>
            </div>
            <SocialMediasFooter/>
        </div>
    );
}