"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { clientInputSchema } from "@/lib/validation/clients";
import { createClient, deleteClient, updateClient } from "@/lib/db/clients";

export type ClientActionState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

function parseForm(formData: FormData) {
  return clientInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    notes: formData.get("notes") ?? "",
    dob: formData.get("dob") ?? "",
  });
}

export async function createClientAction(_prev: ClientActionState, formData: FormData): Promise<ClientActionState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const created = await createClient(user.id, parsed.data);
  revalidatePath("/clients");
  redirect(`/clients/${created.id}`);
}

export async function updateClientAction(
  id: string,
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  await updateClient(user.id, id, parsed.data);
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  const user = await requireUser();
  await deleteClient(user.id, id);
  revalidatePath("/clients");
  redirect("/clients");
}
