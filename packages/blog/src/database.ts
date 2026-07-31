/**
 * @fileoverview Minimal Supabase `Database` shape for blog tables.
 *
 * Matches the planned Wave 0 migration (authors, categories, extended posts).
 * Keep column names in sync with `supabase/migrations` when T1 lands.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * JSON value type used for jsonb columns (`faq`, `sources`).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { readonly [key: string]: Json | undefined }
  | Json[];

/**
 * Row shape for `public.posts` after the Admin Blog migration.
 */
export type PostRow = {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
  author_id: string | null;
  reading_time_minutes: number | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  og_image_url: string | null;
  key_takeaway: string | null;
  faq: Json;
  sources: Json;
  category_id: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  related_post_ids: string[] | null;
};

/**
 * Insert payload for `public.posts`.
 */
export type PostInsert = {
  id?: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body_md?: string;
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  updated_at?: string;
  author_id?: string | null;
  reading_time_minutes?: number | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  og_image_url?: string | null;
  key_takeaway?: string | null;
  faq?: Json;
  sources?: Json;
  category_id?: string | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  related_post_ids?: string[] | null;
};

/**
 * Update payload for `public.posts`.
 */
export type PostUpdate = {
  slug?: string;
  title?: string;
  excerpt?: string;
  body_md?: string;
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  updated_at?: string;
  author_id?: string | null;
  reading_time_minutes?: number | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  og_image_url?: string | null;
  key_takeaway?: string | null;
  faq?: Json;
  sources?: Json;
  category_id?: string | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  related_post_ids?: string[] | null;
};

/**
 * Row shape for `public.authors`.
 */
export type AuthorRow = {
  id: string;
  site_id: string;
  name: string;
  bio: string;
  photo_url: string | null;
  updated_at: string;
};

/**
 * Insert payload for `public.authors`.
 */
export type AuthorInsert = {
  id?: string;
  site_id: string;
  name: string;
  bio?: string;
  photo_url?: string | null;
  updated_at?: string;
};

/**
 * Update payload for `public.authors`.
 */
export type AuthorUpdate = {
  name?: string;
  bio?: string;
  photo_url?: string | null;
  updated_at?: string;
};

/**
 * Row shape for `public.categories`.
 */
export type CategoryRow = {
  id: string;
  site_id: string;
  slug: string;
  name: string;
};

/**
 * Insert payload for `public.categories`.
 */
export type CategoryInsert = {
  id?: string;
  site_id: string;
  slug: string;
  name: string;
};

/**
 * Update payload for `public.categories`.
 */
export type CategoryUpdate = {
  slug?: string;
  name?: string;
};

/**
 * Row shape for `public.instagram_reels` (curated Instagram showcase).
 */
export type InstagramReelRow = {
  id: string;
  site_id: string;
  permalink: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Insert payload for `public.instagram_reels`.
 */
export type InstagramReelInsert = {
  id?: string;
  site_id: string;
  permalink: string;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

/**
 * Update payload for `public.instagram_reels`.
 */
export type InstagramReelUpdate = {
  permalink?: string;
  sort_order?: number;
  is_published?: boolean;
  updated_at?: string;
};

/**
 * Typed Database schema covering blog-related tables only.
 */
export type Database = {
  public: {
    Tables: {
      posts: {
        Row: PostRow;
        Insert: PostInsert;
        Update: PostUpdate;
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      authors: {
        Row: AuthorRow;
        Insert: AuthorInsert;
        Update: AuthorUpdate;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [];
      };
      instagram_reels: {
        Row: InstagramReelRow;
        Insert: InstagramReelInsert;
        Update: InstagramReelUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/**
 * Supabase client typed against blog tables.
 * Callers create the client (anon or authenticated) via `@seo/db` and pass it in.
 */
export type BlogSupabaseClient = SupabaseClient<Database>;

/**
 * Post row plus optional joined author / category from nested selects.
 */
export type PostRowWithJoins = PostRow & {
  author?: AuthorRow | AuthorRow[] | null;
  category?: CategoryRow | CategoryRow[] | null;
};
