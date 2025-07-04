"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SubmitButtonProps {
  /**
   * State indicating if the form is submitting from parent component
   */
  isSubmitting: boolean;

  /**
   * Button text when not submitting
   */
  text: string | ReactNode;

  /**
   * Button text when submitting
   */
  submittingText: string | ReactNode;

  /**
   * Optional icon to display when not submitting
   */
  icon?: ReactNode;

  /**
   * Optional variant
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * Reusable submit button component with loading state
 */
export function SubmitButton({
  isSubmitting,
  text,
  submittingText,
  icon,
  variant = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;

  return (
    <Button type="submit" className="w-full transition-all" disabled={isDisabled} variant={variant}>
      {isDisabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submittingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </>
      )}
    </Button>
  );
}
