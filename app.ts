import dotenv from "dotenv";
import { app } from "./src";
import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";

dotenv.config({ path: "./.env.development" });

const port = process.env.PORT || 3000;

type UserAzureAD = {
  id: string;
  employeeId: string;
  givenName: string;
  surname: string;
  displayName: string;
  department: string | undefined;
  jobTitle: string | undefined;
  mail: string | undefined;
};

app.get("/", (req, res) => {
  res.send(`My name is ${process.env.NAME}`);
});

app.get("/users", async (req, res) => {
  try {
    //App credencial
    const tenantId = process.env.TENANT_ID || "";
    const clientId = process.env.CLIENT_ID || "";
    const clientSecret = process.env.CLIENT_SECRET || "";

    //Create client credential 
    const credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );

    //Auth provided using app credential
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    //Create client to use Azure Active Directory
    const client = Client.initWithMiddleware({
      authProvider,
    });

    const users = await client
      .api("/users")
      .select([
        "id",
        "employeeId",
        "givenName",
        "surname",
        "displayName",
        "department",
        "jobTitle",
        "mail",
      ])
      .get();

    const usersMap = users.value.map((user: UserAzureAD) => ({
      id: user.id,
      employeeId: user.employeeId,
      fullName: `${user.givenName} ${user.surname}`,
      displayName: user.displayName,
      department: user.department,
      job: user.jobTitle,
      mail: user.mail,
    }));

    res.json(usersMap);
  } catch (err: any) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Running on: http://localhost:${port}`);
});
