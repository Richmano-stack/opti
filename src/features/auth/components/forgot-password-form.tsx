"use client"

import Link from "next/link"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/server/auth/client"

const confirmation =
  "If an account exists for that email, we sent a link to choose a new password."

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const requestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {submitted ? (
            <div className="flex flex-col justify-center p-6 md:p-8" role="status">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Check your email</h1>
                  <p className="text-balance text-muted-foreground">{confirmation}</p>
                </div>
                <Field>
                  <Link href="/login" className={buttonVariants()}>
                    Back to sign in
                  </Link>
                </Field>
              </FieldGroup>
            </div>
          ) : (
            <form className="p-6 md:p-8" onSubmit={requestReset} aria-busy={isSubmitting}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Forgot your password?</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter the email on your account and we&apos;ll send you a link to choose a new password.
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
                    disabled={isSubmitting}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle aria-hidden="true" className="animate-spin" data-icon="inline-start" />
                        Sending link
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Remembered it? <Link href="/login">Back to sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
