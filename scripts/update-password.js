// Script para atualizar senha do usuário no Supabase
// Uso: node scripts/update-password.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Carrega variáveis do .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!');
  console.error('Certifique-se de que .env.local contém:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updatePassword() {
  const email = 'abcip@admin.com';
  const newPassword = '@ABCIP2025#';

  console.log('🔄 Atualizando senha do usuário...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Nova senha: ${newPassword}`);

  try {
    // Primeiro, encontre o usuário pelo email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Usuário com email ${email} não encontrado!`);
      console.log('\n📋 Usuários disponíveis:');
      users.users.forEach(u => {
        console.log(`  - ${u.email} (ID: ${u.id})`);
      });
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.email} (ID: ${user.id})`);

    // Atualiza a senha usando a API admin
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      throw error;
    }

    console.log('✅ Senha atualizada com sucesso!');
    console.log('\n📝 Credenciais atualizadas:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${newPassword}`);
    console.log('\n✨ Você pode fazer login agora!');

  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message);
    process.exit(1);
  }
}

updatePassword();

