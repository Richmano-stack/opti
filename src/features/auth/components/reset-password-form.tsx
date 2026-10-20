"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel"
import { authClient } from "@/server/auth/client"

type ResetPasswordPanelProps = {
  token: string | null
  error: string | null
}

export function ResetPasswordForm(props: Partial<ResetPasswordPanelProps> = {}) {
  if ("token" in props || "error" in props) {
    return <ResetPasswordPanel token={props.token ?? null} error={props.error ?? null} />
  }

  return (
    <Suspense fallback={null}>
      <ResetPasswordFromSearch />
    </Suspense>
  )
}

function ResetPasswordFromSearch() {
  const searchParams = useSearchParams()
  return <ResetPasswordPanel token={searchParams.get("token")} error={searchParams.get("error")} />
}

function ResetPasswordPanel({ token, error }: ResetPasswordPanelProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const linkIsInvalid = error === "INVALID_TOKEN" || !token

  const savePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    setPasswordMismatch(false)
    setIsSubmitting(true)
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    })
    setIsSubmitting(false)
    if (resetError) {
      toast.error(resetError.message ?? "This reset link is no longer valid.")
      return
    }
    toast.success("Password updated. Sign in with the new password.")
    router.push("/login")
  }

  return (
    <ResetPasswordCard>
      {linkIsInvalid ? (
        <div className="flex flex-col justify-center p-6 md:p-8">
          <FieldGroup>
            <div role="alert" className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">This link is no longer valid</h1>
              <p className="text-balance text-muted-foreground">
                Request a new reset link and open it before it expires.
              </p>
            </div>
            <Field>
              <Link href="/forgot-password" className={buttonVariants()}>
                Request a new link
              </Link>
            </Field>
          </FieldGroup>
        </div>
      ) : (
        <form className="p-6 md:p-8" onSubmit={savePassword} aria-busy={isSubmitting}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Choose a new password</h1>
              <p className="text-balance text-muted-foreground">
                This replaces the password on your account. You&apos;ll sign in again afterward.
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isSubmitting}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setPasswordMismatch(false)
                }}
              />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field data-invalid={passwordMismatch || undefined}>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isSubmitting}
                aria-invalid={passwordMismatch || undefined}
                aria-describedby={passwordMismatch ? "confirm-password-error" : undefined}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setPasswordMismatch(false)
                }}
              />
              {passwordMismatch ? (
                <FieldError id="confirm-password-error">Passwords do not match.</FieldError>
              ) : null}
            </Field>
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" data-icon="inline-start" />
                    Saving password
                  </>
                ) : (
                  "Save password"
                )}
              </Button>
            </Field>
            <FieldDescription className="text-center">
              <Link href="/login">Back to sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      )}
    </ResetPasswordCard>
  )
}

function ResetPasswordCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {children}
          <AuthBrandPanel />
        </CardContent>
      </Card>
    </div>
  )
}
