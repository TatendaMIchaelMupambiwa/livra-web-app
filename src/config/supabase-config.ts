import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_API_KEY

console.log('==============================')
console.log('SUPABASE URL:', supabaseUrl)
console.log('SUPABASE KEY EXISTS:', !!supabaseKey)
console.log('==============================')

const supabaseConfig = createClient(
  supabaseUrl!,
  supabaseKey!
)

export default supabaseConfig