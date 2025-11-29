import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {signInWithPopup} from 'firebase/auth';
import {auth, googleProvider} from '../firebase';
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import {StandardNavigationBar} from "../components/layout/StandardNavigationBar.tsx";
import {SocialMediaFooter} from "../components/layout/SocialMediaFooter.tsx";
import {GoogleLogo} from "../components/logos/authPage/GoogleLogo.tsx";
import {ErrorLogo} from "../components/logos/authPage/ErrorLogo.tsx";

export default function AuthPage() {
    const {isDarkMode} = useTheme();
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
            // @ts-expect-error
        } catch (error: Error) {
            setError(error.message);
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

            login(idToken, res.user);
            navigate('/folders');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
        } catch (error: Error) {
            if (error.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled");
            } else {
                setError((error as Error).message);
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                    isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/10'
                }`}></div>
                <div
                    className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                        isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
                    }`}
                    style={{animationDelay: '1s'}}>
                </div>
                <div
                    className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                        isDarkMode ? 'bg-pink-500/10' : 'bg-pink-500/5'
                    }`}
                    style={{animationDelay: '2s'}}>
                </div>
            </div>

            <StandardNavigationBar/>

            <div className="flex items-center justify-center px-4 py-12 relative z-10" style={{minHeight: 'calc(100vh - 4rem)'}}>
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            LCorpNotes
                        </h1>
                    </div>

                    <div className={`rounded-2xl shadow-2xl p-8 space-y-6 border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-gray-700/50'
                            : 'bg-white/90 backdrop-blur-xl border-gray-200'
                    }`}>
                        <div className="text-center">
                            <h2 className={`text-3xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {mode === 'login' ? "Welcome Back!" : "Create Account"}
                            </h2>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {mode === 'login'
                                    ? "Sign in to access your notes"
                                    : "Get started with LCorpNotes"}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                id="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="AngelicaMyWaifu@gmail.com"
                                required
                                className={isDarkMode
                                    ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                }
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
                                    className={isDarkMode
                                        ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                    }
                                />
                            )}

                            <Input
                                id="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Angel228"
                                required
                                className={isDarkMode
                                    ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/50'
                                }
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40">
                                {mode === 'login' ? "Sign in" : "Create account"}
                            </Button>
                        </form>

                        {error && (
                            <div className={`flex items-center gap-2 p-3 border rounded-xl text-sm backdrop-blur-sm ${
                                isDarkMode
                                    ? 'bg-red-900/40 border-red-500/50 text-red-300'
                                    : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                                <ErrorLogo/>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${
                                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                                }`}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-3 font-medium ${
                                    isDarkMode ? 'bg-gray-800/80 text-gray-400' : 'bg-white text-gray-600'
                                }`}>
                                    Or continue with other services
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className={`w-full flex items-center justify-center gap-3 px-4 py-3 border-2 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                                isDarkMode
                                    ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                    : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                            }`}>
                            <GoogleLogo/>
                            {googleLoading ? "Signing in..." : "Continue with Google"}
                        </button>

                        <div className={`text-center pt-4 border-t ${
                            isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
                        }`}>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            </span>
                            {"   "}
                            <button
                                className={`font-semibold focus:outline-none transition ${
                                    isDarkMode
                                        ? 'text-indigo-400 hover:text-indigo-300'
                                        : 'text-indigo-600 hover:text-indigo-700'
                                }`}
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                                {mode === 'login' ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>
                    <p className={`mt-6 text-center text-sm ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                        😭 I hope I'll never do web-development ever again
                    </p>
                </div>
            </div>
            <SocialMediaFooter/>
        </div>
    );
}