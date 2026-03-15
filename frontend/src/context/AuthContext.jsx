import { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as authApi from '../api/auth'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Use a Ref to prevent double-syncing on the same mount (Strict Mode fix)
    const syncInProgress = useRef(false)

    /* ---------- Bootstrap Auth State ---------- */

    useEffect(() => {
        async function bootstrapAuth() {
            // If we're already syncing or already have a user, don't run again
            if (syncInProgress.current) return;

            try {
                syncInProgress.current = true;

                // 1. Check Supabase session
                const { data: { session } } = await supabase.auth.getSession();

                // 2. Only sync if Supabase has a session AND we don't already have a local Payload user
                if (session) {
                    const syncedUser = await authApi.loginWithSupabaseToken(session.access_token);
                    if (syncedUser) {
                        setUser(syncedUser);
                        setLoading(false);
                        return;
                    }
                }

                // 3. Fallback to Payload 'me'
                const me = await authApi.getMe();
                setUser(me);

            } catch (err) {
                console.error('Auth bootstrap error:', err);
                setUser(null);
            } finally {
                setLoading(false);
                syncInProgress.current = false;
            }
        }
        bootstrapAuth();
    }, []);
    /* ---------- Actions ---------- */

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // On return, bootstrapAuth() runs again and handles the sync automatically
                redirectTo: window.location.origin,
            },
        })

        if (error) throw error
        return data
    }

    const login = async (email, password) => {
        const user = await authApi.login(email, password)
        setUser(user)
        return user
    }

    const signup = async (formData) => {
        const user = await authApi.signup(formData)
        setUser(user)
        return user
    }

    const refreshUser = async () => {
        try {
            // Check both to be safe
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const syncedUser = await authApi.loginWithSupabaseToken(session.access_token);
                setUser(syncedUser);
                return;
            }

            const me = await authApi.getMe();
            setUser(me);
        } catch {
            setUser(null);
        }
    }

    const logout = async () => {
        setLoading(true);
        try {
            // CRITICAL: We MUST await these to ensure localStorage and Cookies are cleared
            // before the page reloads or the state changes.
            await supabase.auth.signOut();
            await authApi.logout();

            setUser(null);
            // Redirect home to ensure a clean state
            window.location.href = '/';
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                refreshUser,
                loginWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)