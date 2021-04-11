import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";


class XMsClientPrincipalAuthenticationProvider implements AuthenticationProvider {
  private xMsClientPrincipal: string; 

  constructor(xMsClientPrincipal: string) {
    this.xMsClientPrincipal = xMsClientPrincipal 
  }
  getAccessToken() {
    return new Promise<string>((resolve, reject) => {
      if (this.xMsClientPrincipal) {
        resolve(this.xMsClientPrincipal)
      } else {
        reject('x-ms-principal is missing')
      }
    })
  }
}

export default XMsClientPrincipalAuthenticationProvider;
