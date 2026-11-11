import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'SUPABASE_', 'Supabase'],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(
        env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://lcvgnjdisjtjzneyhwcj.supabase.co'
      ),
      'import.meta.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
        env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
      ),
      'import.meta.env.SUPABASE_SECRET_KEY': JSON.stringify(
        env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_SECRET_KEY || ''
      ),
      'import.meta.env.SUPABASE_BUCKET': JSON.stringify(
        env.SUPABASE_BUCKET || env.VITE_SUPABASE_BUCKET || 'Ayurnexaa'
      ),
      'import.meta.env.SUPABASE_S3_ENDPOINT': JSON.stringify(env.SUPABASE_S3_ENDPOINT || ''),
      'import.meta.env.SupabaseS3acceskeyid': JSON.stringify(env.SupabaseS3acceskeyid || ''),
      'import.meta.env.supabaseS3accesssecretkey': JSON.stringify(env.supabaseS3accesssecretkey || ''),
      'import.meta.env.supabaseS3region': JSON.stringify(env.supabaseS3region || ''),
    },
  }
})

