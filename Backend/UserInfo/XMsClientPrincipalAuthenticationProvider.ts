import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";


class XMsClientPrincipalAuthenticationProvider implements AuthenticationProvider {
  private xMsClientPrincipal: string; 

  constructor(xMsClientPrincipal: string) {
    this.xMsClientPrincipal = xMsClientPrincipal 
  }
  getAccessToken() {
    return new Promise<string>(() => { return this.xMsClientPrincipal })
  }
}

export default XMsClientPrincipalAuthenticationProvider;
