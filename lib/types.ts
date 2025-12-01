export interface SiteSettings {
  id?: string;
  site_name: string;
  site_description?: string;
  contact_email?: string;
  logo_url?: string;
  logo_white_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FooterSettings {
  id?: string;
  address?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  background_image_url?: string;
  links?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  order: number;
  active: boolean;
  enable_zoom?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CTASection {
  id?: string;
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
  cta2_button_color?: string;
  cta2_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Publicacao {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PublicacoesPageSettings {
  id?: string;
  banner_image_url?: string;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface Associate {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  author?: string;
  publish_date?: string;
  external_link?: string;
  views?: number;
  likes?: number;
  shares?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  order_index?: number;
  active?: boolean;
  published?: boolean;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StrategicCommittee {
  id: string;
  name: string;
  leader_name?: string;
  leader_email?: string;
  description?: string;
  image_url?: string;
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  approved: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface AboutPage {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  banner_image?: string;
  updated_at?: string;
}
