import { supabase } from "../config/supabaseClient";

// Delete installation data
// See https://supabase.com/docs/reference/javascript/delete
const deleteInstall = async (id: string) => {
  const { data, error } = await supabase
    .from("installations")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("error: ", error);
    throw new Error("Failed deleting installation");
  }

  return data;
};

export default deleteInstall;
