import Image from "next/image";
import { Mail } from "lucide-react";
import { StrategicCommittee } from "@/lib/types";

interface StrategicCommitteeCardProps {
  committee: StrategicCommittee;
}

export default function StrategicCommitteeCard({ committee }: StrategicCommitteeCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md w-full flex flex-col">
      {/* Imagem ocupando todo o topo do card - sem título, sem bordas, sem espaços, tamanho natural */}
      <div className="w-full bg-dark-900 flex-shrink-0 flex items-center justify-center">
        {committee.image_url ? (
          <img
            src={committee.image_url}
            alt={committee.name}
            className="w-full h-auto block"
            style={{ display: 'block', width: '100%' }}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {committee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Seção de texto com fundo cinza claro, texto ALINHADO À ESQUERDA, com bastante padding */}
      <div className="bg-gray-100 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 flex-1 overflow-y-auto">
        {committee.leader_name && (
          <div className="mb-3 sm:mb-4">
            <p className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
              {committee.leader_name}
            </p>
            {committee.leader_email && (
              <a
                href={`mailto:${committee.leader_email}`}
                className="text-xs sm:text-sm md:text-base text-gray-700 hover:text-primary-500 transition flex items-center gap-1 sm:gap-2 break-all"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">{committee.leader_email}</span>
              </a>
            )}
          </div>
        )}
        
        {committee.description && (
          <div
            className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none font-archivo font-thin text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-left text-gray-700"
            dangerouslySetInnerHTML={{ __html: committee.description }}
          />
        )}
      </div>
    </div>
  );
}

