"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="submit-button" type="submit" disabled={pending}>{pending ? "SENDING…" : "SUBMIT QUOTE →"}</button>;
}
