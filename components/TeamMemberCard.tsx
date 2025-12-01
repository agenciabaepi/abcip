import Image from "next/image";
import { TeamMember } from "@/lib/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white flex flex-col items-center text-center">
      {/* Foto */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mb-3 sm:mb-4 bg-gray-100 rounded-lg overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Nome em negrito */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
      
      {/* Cargo */}
      <p className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">{member.position}</p>
      
      {/* Email */}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="text-xs sm:text-sm text-gray-700 hover:text-primary-500 transition-colors break-all px-2"
        >
          {member.email}
        </a>
      )}
    </div>
  );
}

