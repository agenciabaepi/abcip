import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { BoardMember } from "@/lib/types";

interface BoardMemberProfileProps {
  member: BoardMember;
  index: number;
}

export default function BoardMemberProfile({ member, index }: BoardMemberProfileProps) {
  const isEven = index % 2 === 0;
  const hasPhoto = !!member.photo_url;

  return (
    <div className="mb-8 md:mb-10 last:mb-0">
      <div
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } gap-4 md:gap-6 items-start`}
      >
        {/* Foto com Badge */}
        <div className={`w-full md:w-2/5 ${isEven ? "md:order-1" : "md:order-2"}`}>
          <div className="relative w-full max-w-xs mx-auto md:mx-0">
            <div className="relative aspect-[3/4] w-full">
              {hasPhoto && member.photo_url ? (
                <Image
                  src={member.photo_url}
                  alt={member.name}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800 rounded-lg">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Badge verde sobre a foto */}
            <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white p-2.5 md:p-3 rounded-b-lg">
              <h3 className="text-sm md:text-base font-bold mb-0.5">{member.name}</h3>
              <p className="text-xs font-medium mb-1.5 opacity-95">
                {member.position}
              </p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-xs opacity-90 hover:opacity-100 transition flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{member.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Biografia */}
        <div className={`w-full md:w-3/5 ${isEven ? "md:order-2" : "md:order-1"}`}>
          <div className="space-y-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-primary-500 mb-2">
                {member.position}
              </p>
            </div>
            
            {member.bio && (
              <div
                className="text-gray-700 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: member.bio }}
              />
            )}

            {/* Botão de Email */}
            {member.email && (
              <div className="pt-3">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors text-xs ml-2"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

