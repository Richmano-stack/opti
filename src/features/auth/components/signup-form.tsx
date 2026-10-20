"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ACCOUNT_HOME, getSafeCallbackUrl } from "@/features/auth/lib/callback-url"
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel"
import { authClient } from "@/server/auth/client"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"))

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const loginHref =
    callbackUrl === ACCOUNT_HOME || callbackUrl === "/"
      ? "/login"
      : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }

    setPasswordMismatch(false)
    setIsSubmitting(true)

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] || "User",
      callbackURL: callbackUrl,
    })

    setIsSubmitting(false)

    if (error) {
      toast.error(error.message ?? "Registration failed")
      return
    }

    setVerificationSent(true)
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
          {verificationSent ? (
            <div className="p-6 md:p-8" role="status">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Check your email</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    We sent a verification link to {email}. Open it to finish
                    creating your account.
                  </p>
                </div>
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={resendVerification}
                  >
                    Resend verification email
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Already verified? <Link href={loginHref}>Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </div>
          ) : (
          <form className="p-6 md:p-8" onSubmit={handleSignUp} aria-busy={isSubmitting}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
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
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setPasswordMismatch(false)
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      aria-invalid={passwordMismatch || undefined}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value)
                        setPasswordMismatch(false)
                      }}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                {passwordMismatch ? (
                  <FieldError>Passwords do not match.</FieldError>
                ) : null}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>Create Account</Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link href={loginHref}>Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          )}
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
