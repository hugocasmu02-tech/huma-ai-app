import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const saveLead = async (leadData: any, answers: any, scores: any) => {
    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                email: leadData.email,
                full_name: leadData.name,
                clinic_name: leadData.clinic,
                responses: answers,
                scores: scores,
                recommended_package: scores.principal_name
            }
        ])

    if (error) throw error
    return data
}
