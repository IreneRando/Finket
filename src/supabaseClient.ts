import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://grpbikvqhhzaclxrgayu.supabase.co";
const supabaseAnonKey = "sb_publishable_eHbL820FFwnwLaq60ausYQ_Uat2jsLD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
