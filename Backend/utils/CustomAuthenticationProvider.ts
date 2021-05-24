import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { DefaultAzureCredential } from "@azure/identity";

class CustomAuthenticationProvider implements AuthenticationProvider {
  private azureCredential: DefaultAzureCredential;

  constructor() {
    this.azureCredential = new DefaultAzureCredential();
  }

  getAccessToken = async () => {
    const accessToken = await this.azureCredential.getToken([
      "https://graph.microsoft.com/.default",
    ]);
    return accessToken.token;
  };
}

export default CustomAuthenticationProvider;
