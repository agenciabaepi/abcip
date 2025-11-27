export interface SiteSettings {
  id?: string;
  site_name: string;
  site_description?: string;
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
  youtube?: string;
  background_image_url?: string;
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
