import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json();
    
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Tokens missing" }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    console.log("Setting session with tokens...");
    
    // Sincroniza a sessão com os tokens recebidos do cliente
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error("setSession error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Session set successfully, user:", data?.user?.email);

    if (data.user && data.session) {
      // Verifica se a sessão foi salva
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session after setSession:", session ? "exists" : "missing");
      
      // A sessão foi salva nos cookies pelo createClient do servidor
      return NextResponse.json({ 
        success: true, 
        user: data.user 
      });
    }

    return NextResponse.json({ error: "Session sync failed" }, { status: 400 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

