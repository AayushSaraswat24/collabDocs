'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome to CollabDoc
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Collaborate in real-time with your team
          </p>
        </div>

       
        <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="space-y-2 text-center">
            <h2 className="text-xl sm:text-2xl font-medium">
              Sign in to continue
            </h2>
            <p className="text-sm text-muted-foreground">
              Access your documents and start collaborating
            </p>
          </div>

         
          <button
            onClick={() => signIn("google", { callbackUrl: "/testdocs", redirect: false })}
            className="w-full flex items-center justify-center gap-3 bg-background hover:bg-accent text-foreground font-medium py-3 px-4 rounded-lg border border-input shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm sm:text-base">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Secure authentication
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time collaboration with your team</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Access your documents from anywhere</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure cloud storage for all your files</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground px-4">
          By signing in, you agree to our{' '}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}