import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";


class XMsClientPrincipalAuthenticationProvider implements AuthenticationProvider {
  private xMsClientPrincipal: string; 

  constructor(xMsClientPrincipal: string) {
    this.xMsClientPrincipal = xMsClientPrincipal 
  }
  getAccessToken() {
    return new Promise<string>(() => { return this.xMsClientPrincipal }, (error) => return `Failed in the AuthenticationProvider with error: ${error}`)
  }
}

export default XMsClientPrincipalAuthenticationProvider;
