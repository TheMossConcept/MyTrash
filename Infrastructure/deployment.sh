# Obviously, you need to change the tenant ID here, when you change the tenant (e.g. the Directory). 
# Also, we need to do the login outside of this script, as it requires interaction with a browser.
# az login --tenant 17368d8c-b9ce-409c-ba95-ead421daaaa0    7                                                                                                                                                                                                                                                                                                                             8 cosmos_staging_name=$(az deployment group create --resource-group $rg_name --template-file CosmosDB\ -\ Staging/template.json --parameters CosmosDB\ -\ Staging/parameters.json --query "properties.parameters.name.value" -o tsv)


rg_name=rg-houe-mytrash 
az group create -l westeurope -n $rg_name

cosmos_staging_name=$(az deployment group create --resource-group $rg_name --template-file CosmosDB\ -\ Staging/template.json --parameters CosmosDB\ -\ Staging/parameters.json --query "properties.parameters.name.value" -o tsv)
# Again, we assume that the primary (read/write) connection string is the first in the array. If that is not the case, this value will not be correct!
cosmos_staging_connection_string=$(az cosmosdb keys list -n $cosmos_staging_name -g $rg_name --type connection-strings --query "connectionStrings[0].connectionString" -o tsv)

cosmos_production_name=$(az deployment group create --resource-group $rg_name --template-file CosmosDB\ -\ Production/template.json --parameters CosmosDB\ -\ Production/parameters.json --query "properties.parameters.name.value" -o tsv)
# Again, we assume that the primary (read/write) connection string is the first in the array. If that is not the case, this value will not be correct!
cosmos_production_connection_string=$(az cosmosdb keys list -n $cosmos_production_name -g $rg_name --type connection-strings --query "connectionStrings[0].connectionString" -o tsv)

# Used for function app configuration. We assume there are only two AD apps registered in the tennant, the actual app (as the first) and 
# the extension app as the second. If that assumption does not hold, this step will NOT work as expected!!
ADIssuer=$(az ad app list --query '[0].publisherDomain' -o tsv)
ClientId=$(az ad app list --query '[1].appId' -o tsv | sed 's/-//g')

prod_function_app_name=$(az deployment group create --resource-group $rg_name --template-file Function\ App/template.json --parameters Function\ App/parameters.json --query "properties.parameters.name.value" -o tsv)
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --slot-settings "EnvironmentName=Production"
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --settings "ADIssuer=${ADIssuer}"
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --settings "ClientId=${ClientId}"
az webapp config connection-string set --name $prod_function_app_name -g $rg_name -t Custom --slot-settings "DBConnectionString=${$cosmos_production_connection_string}"

# Give the managed identity of the production environment access to Microsoft Graph so that it can read and write user data. See https://docs.microsoft.com/en-us/azure/app-service/scenario-secure-app-access-microsoft-graph-as-app?tabs=azure-cli%2Ccommand-line
spId=$(az resource list -n $prod_function_app_name --query "[*].identity.principalId" --out tsv)
graphResourceId=$(az ad sp list --display-name "Microsoft Graph" --query "[0].objectId" --out tsv)
appRoleId=$(az ad sp list --display-name "Microsoft Graph" --query "[0].appRoles[?value=='User.ReadWrite.All' && contains(allowedMemberTypes, 'Application')].id" --output tsv)
uri=https://graph.microsoft.com/v1.0/servicePrincipals/$spId/appRoleAssignments
body="{'principalId':'$spId','resourceId':'$graphResourceId','appRoleId':'$appRoleId'}"
az rest --method post --uri $uri --body $body --headers "Content-Type=application/json"

# The query is a VERY ugly way of getting the slotname out of the creation. Ideally, this should be done in a better way. Consider making another ARM template where the name is in parameters like the others 
az deployment group create --resource-group $rg_name --template-file Function\ App\ -\ Staging/template.json
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --slot staging --slot-settings "EnvironmentName=Staging"
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --slot staging --settings "ADIssuer=${ADIssuer}"
az functionapp config appsettings set --name $prod_function_app_name -g $rg_name --slot staging --settings "ClientId=${ClientId}"
az webapp config connection-string set --name $prod_function_app_name -g $rg_name --slot staging -t Custom --slot-settings "DBConnectionString=${cosmos_staging_connection_string}"

# Give the managed identity of the production environment access to Microsoft Graph so that it can read and write user data. See https://docs.microsoft.com/en-us/azure/app-service/scenario-secure-app-access-microsoft-graph-as-app?tabs=azure-cli%2Ccommand-line
# TODO: I'm not sure the argument passed to -n is valid! Look into this!
spId=$(az resource list -n $prod_function_app_name/staging --query "[*].identity.principalId" --out tsv)
graphResourceId=$(az ad sp list --display-name "Microsoft Graph" --query "[0].objectId" --out tsv)
appRoleId=$(az ad sp list --display-name "Microsoft Graph" --query "[0].appRoles[?value=='User.ReadWrite.All' && contains(allowedMemberTypes, 'Application')].id" --output tsv)
uri=https://graph.microsoft.com/v1.0/servicePrincipals/$spId/appRoleAssignments
body="{'principalId':'$spId','resourceId':'$graphResourceId','appRoleId':'$appRoleId'}"
az rest --method post --uri $uri --body $body --headers "Content-Type=application/json"
