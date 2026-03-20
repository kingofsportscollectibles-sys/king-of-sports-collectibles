import { supabase } from "@/lib/supabase";
import HomePageClient from "./home-page-client";

type Item = {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string | null;
  player: string | null;
  team: string | null;
  sport: string | null;
  year: number | null;
  item_type: string | null;
  category: string | null;
  condition: string | null;
  authentication: string | null;
  status: string;
  featured: boolean;
  image_url: string | null;
};

async function getFeaturedItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase featured items fetch error:", error);
    return [];
  }

  return data ?? [];
}

export default async function HomePage() {
  const featuredItems = await getFeaturedItems();

  return <HomePageClient featuredItems={featuredItems} />;
}
