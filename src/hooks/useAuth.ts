
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useToast } from './use-toast';

export interface UserProfile {
  id: string;
  email?: string;
  createdAt: string;
  lastSignInAt?: string;
  fullName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth state listener, then check for existing session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
          
          // Create basic profile information
          setUserProfile({
            id: newSession.user.id,
            email: newSession.user.email,
            createdAt: new Date(newSession.user.created_at).toISOString(),
            lastSignInAt: newSession.user.last_sign_in_at 
              ? new Date(newSession.user.last_sign_in_at).toISOString() 
              : undefined,
          });
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Welcome back!",
              description: `You are now signed in as ${newSession.user.email}`,
            });
          }
        } else {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been successfully signed out",
            });
          }
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    const fetchUser = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (currentSession) {
        setUser(currentSession.user);
        setSession(currentSession);
        
        // Create basic profile information
        setUserProfile({
          id: currentSession.user.id,
          email: currentSession.user.email,
          createdAt: new Date(currentSession.user.created_at).toISOString(),
          lastSignInAt: currentSession.user.last_sign_in_at 
            ? new Date(currentSession.user.last_sign_in_at).toISOString() 
            : undefined,
        });
        
        // Fetch additional profile info if available
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentSession.user.id)
          .single();
          
        if (profileData) {
          setUserProfile(prev => prev ? {
            ...prev,
            fullName: profileData.full_name || undefined
          } : null);
        }
      }
      
      setLoading(false);
    };

    fetchUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  // Check if user has investments
  const [hasInvestments, setHasInvestments] = useState<boolean>(false);
  
  useEffect(() => {
    const checkInvestments = async () => {
      if (!user) {
        return;
      }
      
      try {
        // Try to load from Supabase first
        const { data: investmentsData, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && investmentsData && investmentsData.length > 0) {
          setHasInvestments(true);
        } else {
          // Fall back to localStorage
          const localInvestments = localStorage.getItem(`vaiot_investments_${user.id}`);
          if (localInvestments) {
            const investments = JSON.parse(localInvestments);
            setHasInvestments(investments.length > 0);
          }
        }
      } catch (err) {
        console.error("Error checking investments:", err);
        // Try localStorage as fallback
        const localInvestments = localStorage.getItem(`vaiot_investments_${user.id}`);
        if (localInvestments) {
          const investments = JSON.parse(localInvestments);
          setHasInvestments(investments.length > 0);
        }
      }
    };
    
    checkInvestments();
  }, [user]);

  return { user, session, loading, hasInvestments, userProfile };
}

// Create a utility function to save investments to both localStorage and Supabase
export async function saveInvestment(
  userId: string, 
  investment: { 
    ethAmount: number; 
    eurValue: number; 
    timestamp: string;
  }
) {
  // First save to localStorage for immediate feedback
  const existingInvestments = localStorage.getItem(`vaiot_investments_${userId}`);
  let investments = [];
  
  if (existingInvestments) {
    try {
      investments = JSON.parse(existingInvestments);
    } catch (e) {
      console.error("Error parsing existing investments:", e);
      investments = [];
    }
  }
  
  investments.push(investment);
  localStorage.setItem(`vaiot_investments_${userId}`, JSON.stringify(investments));
  
  // Then try to save to Supabase if available
  try {
    // We need to use any here because the types for the investments table
    // are not yet available in the Supabase client
    const { error } = await supabase.from('investments' as any).insert([{
      user_id: userId,
      eth_amount: investment.ethAmount,
      eur_value: investment.eurValue,
      created_at: investment.timestamp
    }] as any);
    
    if (error) {
      console.error("Error saving investment to Supabase:", error);
      // Investment is still saved in localStorage as a fallback
    }
  } catch (e) {
    console.error("Error saving to Supabase:", e);
    // Investment is still saved in localStorage as a fallback
  }
}
