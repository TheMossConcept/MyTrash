import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";


class CustomAuthenticationProvider implements AuthenticationProvider {
  private accessToken: string; 

  constructor(accessToken: string) { 
    this.accessToken = accessToken 
  }
  getAccessToken() {
    return new Promise<string>((resolve, reject) => {
      if (this.accessToken) {
        resolve(this.accessToken)
      } else {
        reject('access token is missing')
      }
    })
  }
}

export default CustomAuthenticationProvider;
