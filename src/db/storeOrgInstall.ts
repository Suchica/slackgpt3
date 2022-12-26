import { supabase } from "../config/supabaseClient";
import { Installation } from "../types/slackTypes";

// Store org-wide app installation data
// See https://supabase.com/docs/reference/javascript/upsert
const storeOrgInstall = async (installation: Installation) => {
  const { data, error } = await supabase
    .from("installations")
    .upsert({
      id: installation.enterprise?.id,
      is_enterprise_install: installation.isEnterpriseInstall,
      enterprise_id: installation.enterprise?.id,
      enterprise_name: installation.enterprise?.name,
      team_id: null,
      team_name: null,
      app_id: installation.appId,
      user_id: installation.user.id,
      user_scopes: installation.user.scopes,
      user_token: installation.user.token,
      bot_id: null,
      bot_user_id: null,
      bot_scopes: null,
      bot_token: null,
      auth_version: installation.authVersion,
    })
    .select();

  if (error) {
    console.log("error: ", error);
    throw new Error("Failed saving installation data to installationStore");
  }

  return data;
};

export default storeOrgInstall;
