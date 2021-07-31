# Obviously, you need to change the tenant ID here, when you change the tenant (e.g. the Directory)
az login --tenant 17368d8c-b9ce-409c-ba95-ead421daaaa0
az group create -l westeurope -n rg-houe-mytrash

cosmos_staging_output=$(az deployment group create --resource-group rg-houe-mytrash --template-file CosmosDB\ -\ Staging/template.json)

# Used for function app configuration. We assume there are only two AD apps registered in the tennant, the actual app (as the first) and 
# the extension app as the second. If that assumption does not hold, this step will NOT work as expected!!
ADIssuer=$(az ad app list --query '[0].publisherDomain' -o tsv)
ClientId=$(az ad app list --query '[1].appId' -o tsv | sed 's/-//g')

ProdDBConnectionString=$() 
az deployment group create --resource-group rg-houe-mytrash --template-file Function\ App/template.json

StagingDBConnectionString=$() 
az deployment group create --resource-group rg-houe-mytrash --template-file Function\ App\ -\ Staging/template.json
