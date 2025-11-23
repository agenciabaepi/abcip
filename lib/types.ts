export interface Post {
  id: string;
  title: string;
  content: string;
  cover_image?: string;
  excerpt?: string;
  published: boolean;
  external_link?: string;
  publish_date?: string;
  author?: string;
  views?: number;
  likes?: number;
  shares?: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order: number;
  enable_zoom?: boolean;
  created_at: string;
}

export interface Associate {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
  created_at: string;
}

export interface AboutPage {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  banner_image?: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  linkedin?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  linkedin?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface FooterSettings {
  id: string;
  address?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  links?: string; // JSON string
  background_image_url?: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description?: string;
  contact_email?: string;
  logo_url?: string;
  logo_white_url?: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

export interface CTASection {
  id: string;
  title: string;
  description: string;
  button_text: string;
  button_link?: string;
  image_url?: string;
  active: boolean;
  use_dual_cta?: boolean;
  cta1_button_color?: string;
  cta2_title?: string;
  cta2_description?: string;
  cta2_button_text?: string;
  cta2_button_link?: string;
  cta2_image_url?: string;
  cta2_background_color?: string;
  cta2_text_color?: string;
  cta2_button_color?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

