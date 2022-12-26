import { supabase } from "../config/supabaseClient";
import { Installation } from "../types/slackTypes";

// Store workspace app installation data
// See https://supabase.com/docs/reference/javascript/upsert
const storeWorkspaceInstall = async (installation: Installation) => {
  const { data, error } = await supabase
    .from("installations")
    .upsert({
      id: installation.team?.id, // Not null, but TS doesn't know that
      is_enterprise_install: installation.isEnterpriseInstall,
      enterprise_id: null,
      enterprise_name: null,
      team_id: installation.team?.id,
      team_name: installation.team?.name,
      app_id: installation.appId,
      user_id: installation.user.id,
      user_scopes: null,
      user_token: null,
      bot_id: installation.bot?.id,
      bot_user_id: installation.bot?.userId,
      bot_scopes: installation.bot?.scopes,
      bot_token: installation.bot?.token,
      auth_version: installation.authVersion,
    })
    .select();

  if (error) {
    console.log("error: ", error);
    throw new Error("Failed saving installation data to installationStore");
  }

  return data;
};

export default storeWorkspaceInstall;
