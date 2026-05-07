import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mdhdmlnktuhsqtibhkxy.supabase.co', 
  'sb_publishable_CUWNhxWHsFXwjqZs_aIW3A_fehdx5nw'
);

async function run() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*");
  console.log("Categorias:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}

run();
