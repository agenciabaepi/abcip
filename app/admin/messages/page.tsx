import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { ContactMessage } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone } from "lucide-react";

export default async function MessagesPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mensagens de Contato</h1>

      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          (messages as ContactMessage[]).map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {message.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <time
                  dateTime={message.created_at}
                  className="text-sm text-gray-500"
                >
                  {format(new Date(message.created_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </time>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            Nenhuma mensagem recebida ainda.
          </div>
        )}
      </div>
    </div>
  );
}

