import { supabase } from "../config/supabaseClient";

// Get installation data
// See https://supabase.com/docs/reference/javascript/select
const getInstall = async (id: string) => {
  const { data, error } = await supabase
    .from("installations")
    .select() // returns all columns
    .eq("id", id) // where id = $1
    .single(); // returns a single row. See https://supabase.com/docs/reference/javascript/single

  if (error) {
    console.log("error: ", error);
    throw new Error("Failed fetching installation");
  }

  return data;
};

export default getInstall;
