import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { HttpRequestHeaders } from "@azure/functions"


class CustomAuthenticationProvider implements AuthenticationProvider {
  private accessToken: string; 

  constructor(requestHeaders: HttpRequestHeaders) { 
    const accessToken = requestHeaders['access-token']
    if (accessToken) {
      this.accessToken = accessToken 
    } else {
      throw 'access-token header is missing in request'  
    }
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
