"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Associate } from "@/lib/types";
import { Edit } from "lucide-react";
import DeleteAssociateButton from "./DeleteAssociateButton";
import ReorderAssociateButton from "./ReorderAssociateButton";

interface AssociatesListProps {
  associates: Associate[];
}

export default function AssociatesList({ associates: initialAssociates }: AssociatesListProps) {
  const router = useRouter();
  const [associates, setAssociates] = useState(initialAssociates);

  useEffect(() => {
    setAssociates(initialAssociates);
  }, [initialAssociates]);

  const handleReorder = () => {
    // Recarregar a página para atualizar a ordem
    window.location.reload();
  };

  if (associates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum associado cadastrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {associates.map((associate, index) => (
        <div
          key={associate.id}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="relative h-32 w-full mb-4">
                <Image
                  src={associate.logo_url}
                  alt={associate.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{associate.name}</h3>
              {associate.website && (
                <a
                  href={associate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-500 hover:text-primary-600 mb-4 block"
                >
                  {associate.website}
                </a>
              )}
            </div>
            <ReorderAssociateButton
              associateId={associate.id}
              currentOrder={associate.order || index}
              isFirst={index === 0}
              isLast={index === associates.length - 1}
              onReorder={handleReorder}
            />
          </div>
          <div className="flex space-x-2 mt-auto">
            <Link
              href={`/admin/associates/${associate.id}`}
              className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-dark-900 px-3 py-2 rounded hover:bg-primary-400 transition text-sm font-semibold"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Link>
            <DeleteAssociateButton associateId={associate.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

