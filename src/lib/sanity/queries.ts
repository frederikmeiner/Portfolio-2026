import { client } from "@/sanity/client";

export type Skill = {
  _id: string;
  name: string;
  category: string;
  level?: string;
  icon?: string;
  order?: number;
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: { asset: { url: string }; hotspot?: object };
  technologies?: Skill[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
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
    `*[_type == "project"] | order(publishedAt desc) {
      _id, title, slug, description, featured, liveUrl, githubUrl, publishedAt,
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

export async function getExperiences(): Promise<Experience[]> {
  return client.fetch(
    `*[_type == "experience"] | order(startDate desc) {
      _id, company, role, startDate, endDate, current, description,
      logo { asset->{ url } },
      technologies[]->{ _id, name, category }
    }`
  );
}
