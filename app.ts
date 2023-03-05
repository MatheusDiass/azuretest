import dotenv from "dotenv";
import { Request, Response } from "express";
import app from "./src";
import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import {
  ClientSecretCredential,
  UsernamePasswordCredential,
} from "@azure/identity";

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

type UserSignIn = {
  username: string;
  password: string;
};

app.get("/", (req, res) => {
  res.send(`My name is ${process.env.NAME}`);
});

app.get("/users", async (req: Request, res: Response) => {
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
    res.send(err);
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    //App credencial
    const tenantId = process.env.TENANT_ID || "";
    const clientId = process.env.CLIENT_ID || "";

    //Create user credential using app credential
    const credential = new UsernamePasswordCredential(
      tenantId,
      clientId,
      username,
      password
    );

    const token = await credential.getToken(['profile']);

    res.json({ token });
  } catch (err: any) {
    console.log(err);
    
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Running on: http://localhost:${port}`);
});
