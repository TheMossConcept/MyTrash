import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { DefaultAzureCredential } from "@azure/identity";

class CustomAuthenticationProvider implements AuthenticationProvider {
  private azureCredential: DefaultAzureCredential;

  constructor() {
    this.azureCredential = new DefaultAzureCredential();
  }

  getAccessToken = async () => {
    return "eyJ0eXAiOiJKV1QiLCJub25jZSI6InpvSXdwZ0llY1JaWHF3LVV3em14ckpFa2VtOGJsdjM3Rm9yeDBXYkw5RGsiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTJjYTk5NGYtZDk4Ny00MmUxLThlZjItMjdmOWM5MjJkMTQ1LyIsImlhdCI6MTYyMDYzODcxMCwibmJmIjoxNjIwNjM4NzEwLCJleHAiOjE2MjA2NDI2MTAsImFjY3QiOjAsImFjciI6IjEiLCJhY3JzIjpbInVybjp1c2VyOnJlZ2lzdGVyc2VjdXJpdHlpbmZvIiwidXJuOm1pY3Jvc29mdDpyZXExIiwidXJuOm1pY3Jvc29mdDpyZXEyIiwidXJuOm1pY3Jvc29mdDpyZXEzIiwiYzEiLCJjMiIsImMzIiwiYzQiLCJjNSIsImM2IiwiYzciLCJjOCIsImM5IiwiYzEwIiwiYzExIiwiYzEyIiwiYzEzIiwiYzE0IiwiYzE1IiwiYzE2IiwiYzE3IiwiYzE4IiwiYzE5IiwiYzIwIiwiYzIxIiwiYzIyIiwiYzIzIiwiYzI0IiwiYzI1Il0sImFpbyI6IkFWUUFxLzhUQUFBQW5JVXlwa0NvazQzR2d3MmR0d2MwQzVGOUk0ZVlEcjNycjZtOHFNeVV2ZFF2cG5lU1BlR3UyL2FKYXZqMjlnR0tqclBZSXJ6WllpaFBvMExYVXhQKzJaSzVYM244RU5ic001WFpmNU5MQklRPSIsImFsdHNlY2lkIjoiMTpsaXZlLmNvbTowMDAzMDAwMEQwNzNENzE4IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBfZGlzcGxheW5hbWUiOiJNaWNyb3NvZnQgQXp1cmUgQ0xJIiwiYXBwaWQiOiIwNGIwNzc5NS04ZGRiLTQ2MWEtYmJlZS0wMmY5ZTFiZjdiNDYiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6Im5pa2xhcy5ub2VycmVnYWFyZEBnbWFpbC5jb20iLCJmYW1pbHlfbmFtZSI6Ik1vc3MiLCJnaXZlbl9uYW1lIjoiTmlrbGFzIiwiaWRwIjoibGl2ZS5jb20iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyMTMuMzIuMjQyLjIwNyIsIm5hbWUiOiJOaWtsYXMgTW9zcyIsIm9pZCI6ImY0NGRlNWE1LWVmOTQtNGU1MC1iMjMyLTM5NzcwZWYzNWFiZiIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMTM5NjdGMkI3IiwicmgiOiIwLkFTSUFUNW5LRW9mWjRVS084aWY1eVNMUlJaVjNzQVRialJwR3UtNEMtZUdfZTBZeUFGby4iLCJzY3AiOiJBdWRpdExvZy5SZWFkLkFsbCBEaXJlY3RvcnkuQWNjZXNzQXNVc2VyLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIFVzZXIuUmVhZFdyaXRlLkFsbCIsInN1YiI6Ik1sWnRMM0RmcjJDdkkzX2VHOTZkMWRTeGdCUUJuRG52amZBNFl1RERlUmsiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiIxMmNhOTk0Zi1kOTg3LTQyZTEtOGVmMi0yN2Y5YzkyMmQxNDUiLCJ1bmlxdWVfbmFtZSI6ImxpdmUuY29tI25pa2xhcy5ub2VycmVnYWFyZEBnbWFpbC5jb20iLCJ1dGkiOiJtenJCMmMwM0lrS1lKNk5ITTlIREJnIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3RjZHQiOjE2MTk4ODc3MTB9.PxqKn4dtzmqokCvbXcwe6OYTwmsm0XRfcCVH4vpK-E-wxAmTsCU-8f4BTmm14kNufBhcY7v6WF3FF1L_ZBH2oWU6rM3VOq958PaznQB0OYlMol_BexLP3_u_v9xNtXREi7JC-_1FsUGLvom5FgOvJo3uYkCrP6Gw1qn_XcOR9S5wVPDY-sBrO15ABbcpfKfd8KA_BE5OURdu3E9eT3GNXwBPW4uaXddUY4t4iYVYl2stunsbkFINdNQf_x0hXZWQ9z3QstudtGwJRSUibZjuMSwq9NwOV1kDOBOmwXyX2rwBvl5oxualSkPq2so3eW_hQEtPX5oVe86BMm_0j7Fg9g";
    /*
    const accessToken = await this.azureCredential.getToken([
      "User.ReadWrite.All",
    ]);

    return accessToken.token;
    */
  };
}

export default CustomAuthenticationProvider;
