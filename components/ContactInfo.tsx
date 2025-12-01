"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Phone, Mail, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";

export default function ContactInfo() {
  const [footerSettings, setFooterSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const client = createClient();
        const { data } = await client.from("footer_settings").select("*").single();
        if (data) setFooterSettings(data);
      } catch (error) {
        console.warn("Erro ao carregar configurações:", error);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="space-y-8">
      {footerSettings?.phone && (
        <div className="flex items-center gap-4">
          <Phone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-900 flex-shrink-0" />
          <span className="text-gray-900 text-lg sm:text-xl md:text-2xl font-medium">{footerSettings.phone}</span>
        </div>
      )}

      {footerSettings?.email && (
        <div className="flex items-center gap-4">
          <Mail className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-900 flex-shrink-0" />
          <span className="text-gray-900 text-lg sm:text-xl md:text-2xl font-medium">{footerSettings.email}</span>
        </div>
      )}

      {/* Redes Sociais */}
      <div className="flex items-center gap-4 pt-6">
        {footerSettings?.linkedin && (
          <a
            href={footerSettings.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </a>
        )}

        {footerSettings?.instagram && (
          <a
            href={footerSettings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </a>
        )}

        {footerSettings?.facebook && (
          <a
            href={footerSettings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </a>
        )}

        {footerSettings?.youtube && (
          <a
            href={footerSettings.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </a>
        )}
      </div>
    </div>
  );
}

