import type { Metadata } from "next";
import { getAllCountryContacts } from "@/lib/settings";
import { CountryManager } from "@/components/admin/CountryManager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Country numbers" };

export default async function CountriesPage() {
  const countries = await getAllCountryContacts();
  return <CountryManager countries={countries} />;
}
