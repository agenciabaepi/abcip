import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { TeamMember } from "@/lib/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <div className="relative h-64 w-full bg-gray-100">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-sm font-medium text-primary-500 mb-3">{member.position}</p>
        {member.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {member.bio}
          </p>
        )}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
              aria-label={`Enviar email para ${member.name}`}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              aria-label={`LinkedIn de ${member.name}`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

