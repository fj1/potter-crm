"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, FieldError, Input, Label, Textarea } from "@/components/ui";
import {
  createClientAction,
  updateClientAction,
  type ClientActionState,
} from "@/lib/actions/clients";

type ClientFormValues = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  dob?: Date | string | null;
};

function formatDob(dob: Date | string | null | undefined): string {
  if (!dob) return "";
  if (dob instanceof Date) return dob.toISOString().slice(0, 10);
  return dob.slice(0, 10);
}

export function ClientForm({
  mode,
  clientId,
  initial,
}: {
  mode: "create" | "edit";
  clientId?: string;
  initial?: ClientFormValues;
}) {
  const action =
    mode === "create"
      ? createClientAction
      : updateClientAction.bind(null, clientId!);

  const [state, formAction, pending] = useActionState<ClientActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initial?.name ?? ""} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initial?.email ?? ""} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={initial?.phone ?? ""} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} defaultValue={initial?.notes ?? ""} />
      </div>
      <FieldError message={state?.error} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create client" : "Save changes"}
        </Button>
        <Link href={clientId ? `/clients/${clientId}` : "/clients"} className="text-sm text-stone-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
