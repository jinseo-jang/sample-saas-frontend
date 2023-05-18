import { Auth } from "aws-amplify";

export async function fetchUserInformation() {
  try {
    const session = await Auth.currentSession();
    const userAttributes = session.getIdToken().payload;
    const loggedInTenantId = userAttributes["custom:tenant_id"];
    const loggedInUserName = userAttributes["email"];

    return { loggedInTenantId, loggedInUserName };
  } catch (e) {
    if (e !== "No current user") {
      throw e;
    }
    return null;
  }
}
