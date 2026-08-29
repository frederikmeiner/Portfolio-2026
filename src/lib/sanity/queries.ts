import { client } from "@/sanity/client";

export type Skill = {
  _id: string;
  name: string;
  category: string;
  level?: string;
  icon?: string;
  order?: number;
};

/** Størrelse i bento-grid'et. Deles af project og inspiration. */
export type BentoSize = "normal" | "large" | "tall";

/**
 * Fælles form for alt der vises i et bento-grid.
 * Både projekter og inspiration normaliseres til denne type,
 * så BentoCard/BentoGrid kun kender ét format.
 */
export type BentoItem = {
  _id: string;
  title: string;
  description?: string;
  image?: { asset: { url: string } };
  videoUrl?: string;
  liveUrl?: string;
  size?: BentoSize;
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: { asset: { url: string }; hotspot?: object };
  technologies?: Skill[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  size?: BentoSize;
  publishedAt?: string;
};

export type Experience = {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: Array<{ _type: string; children: Array<{ text: string }> }>;
  logo?: { asset: { url: string } };
  technologies?: Skill[];
};

export async function getSkills(): Promise<Skill[]> {
  return client.fetch(
    `*[_type == "skill"] | order(order asc) { _id, name, category, level, icon, order }`
  );
}

export async function getProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(orderRank asc) {
      _id, title, slug, description, featured, size, videoUrl, liveUrl, githubUrl, publishedAt,
      image { asset->{ url }, hotspot },
      technologies[]->{ _id, name, category }
    }`
  );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(publishedAt desc) {
      _id, title, slug, description, liveUrl, githubUrl,
      image { asset->{ url }, hotspot },
      technologies[]->{ _id, name, category }
    }`
  );
}

export type InspirationItem = {
  _id: string;
  project: {
    _id: string;
    title: string;
    description?: string;
    image?: { asset: { url: string }; hotspot?: object };
    videoUrl?: string;
    liveUrl?: string;
  };
  size?: BentoSize;
};

export async function getInspiration(): Promise<InspirationItem[]> {
  return client.fetch(
    `*[_type == "inspiration"] | order(orderRank asc) {
      _id, size,
      project->{ _id, title, description, videoUrl, liveUrl, image { asset->{ url } } }
    }`
  );
}

/** Projekter → bento. Falder tilbage til `featured` hvis `size` ikke er sat i Studio endnu. */
export function projectsToBento(projects: Project[]): BentoItem[] {
  return projects.map((p) => ({
    _id: p._id,
    title: p.title,
    description: p.description,
    image: p.image,
    videoUrl: p.videoUrl,
    liveUrl: p.liveUrl,
    size: p.size ?? (p.featured ? "large" : "normal"),
  }));
}

/** Inspiration → bento. */
export function inspirationToBento(items: InspirationItem[]): BentoItem[] {
  return items.map((item) => ({
    _id: item._id,
    title: item.project.title,
    description: item.project.description,
    image: item.project.image,
    videoUrl: item.project.videoUrl,
    liveUrl: item.project.liveUrl,
    size: item.size,
  }));
}

export async function getExperiences(): Promise<Experience[]> {
  return client.fetch(
    `*[_type == "experience"] | order(startDate desc) {
      _id, company, role, startDate, endDate, current, description,
      logo { asset->{ url } },
      technologies[]->{ _id, name, category }
    }`
  );
}

export type WishImage = {
  asset: {
    url: string;
    metadata?: {
      dimensions?: { aspectRatio?: number; width?: number; height?: number };
      palette?: { dominant?: { background?: string } };
    };
  };
};

export type Wish = {
  _id: string;
  title: string;
  image?: WishImage;
  url?: string;
  brand?: string;
  color?: string;
  /** Valgfri hex-kode — vises som farveprik ved farven. */
  colorHex?: string;
  size?: string;
  length?: string;
  /** Billedets kantfarve — bruges som flade bag produktfotoet. */
  plateColor?: string;
};

export async function getWishlist(): Promise<Wish[]> {
  return client.fetch(
    `*[_type == "wish"] | order(orderRank asc) {
      _id, title, url, brand, color, colorHex, size, length, plateColor,
      image {
        asset->{
          url,
          metadata {
            dimensions { aspectRatio, width, height },
            palette { dominant { background } }
          }
        }
      }
    }`
  );
}
