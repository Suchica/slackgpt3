import { supabase } from "../config/supabaseClient";
import { Installation } from "../types/slackTypes";

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

  // Convert the data to the Installation type
  const installation: Installation = {
    isEnterpriseInstall: data.is_enterprise_install,
    enterprise: {
      id: data?.enterprise_id,
      name: data?.enterprise_name,
    },
    team: {
      id: data?.team_id,
      name: data?.team_name,
    },
    appId: data.app_id,
    user: {
      id: data.user_id,
      scopes: data.user_scopes,
      token: data.user_token,
    },
    tokenType: data.token_type,
    bot: {
      id: data?.bot_id,
      userId: data?.bot_user_id,
      scopes: data?.bot_scopes,
      token: data?.bot_token,
    },
    authVersion: data.auth_version,
  };
    
  return installation;
};

export default getInstall;
