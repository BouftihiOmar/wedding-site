import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fydfnwcteqmonfsurppw.supabase.co'

const supabaseAnonKey = 'sb_publishable_HVbajdSQvZl46XR_H39n8A_8QfUAv-h'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
