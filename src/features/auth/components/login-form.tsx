"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ACCOUNT_HOME, getSafeCallbackUrl } from "@/features/auth/lib/callback-url"
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel"
import { authClient } from "@/server/auth/client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"))

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const signupHref =
    callbackUrl === ACCOUNT_HOME || callbackUrl === "/"
      ? "/signup"
      : `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setNeedsVerification(false)

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    })

    setIsSubmitting(false)

    if (error) {
      if (error.status === 403) {
        setNeedsVerification(true)
        toast.error("Verify your email before signing in.")
        return
      }
      toast.error(error.message ?? "Sign in failed")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  const resendVerification = async () => {
    setIsSubmitting(true)
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: callbackUrl,
    })
    setIsSubmitting(false)
    if (error) {
      toast.error(error.message ?? "The verification email could not be sent.")
      return
    }
    toast.success("Verification email sent.")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSignIn} aria-busy={isSubmitting}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>Login</Button>
                {needsVerification ? (
                  <Button
                    type="button"
                    variant="link"
                    disabled={isSubmitting}
                    onClick={resendVerification}
                  >
                    Resend verification email
                  </Button>
                ) : null}
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href={signupHref}>Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <AuthBrandPanel />
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
