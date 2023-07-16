# The system from a user perspective 

This section describes how the system work, what it does nad how it is used. It's aimed at ordinary users and super users and can be used as a reference when there's any need for support or any doubt about the functionality of it. This is written for version 1 of MyTrash

## Collectors

The collectors are the customers who collect plastic. They only have access to the system through the mobile app which can be accessed on Apple's App  Store or Google's Play store. Collectors can sign up in the app by pressing "create user" on the start screen of the app. Here, collectors can sign up to one of the open clusters that are accessible in the app. In the dropdown, five clusters are shown at a time and the clusters shown will be filtered when the user types which means the desired cluster might not be shown before the list has been sufficiently filtered.

In addition, a collector can be created manually by an administrator or a collection administrator and assigned to an arbitrary cluster. A collector can also sign up for closed clusters manually through the invitation link that is shown in the administrator and collection administrator interfaces underneath each closed cluster. Be aware that everybody with this link can sign up to the closed cluster which the link belongs to.

Every collector is associated with exactly one cluster, never more and never less. Collectors are automatically deleted together with the cluster they belong to and the data in that cluster 30 days after the cluster has been closed.

When the collector has signed up, he can se the progress of his own collection. He can also see the collection progress of the cluster as a whole if the cluster is a closed cluster. In addition, a collector can book a pick-up of his pastic and access various information through the buttons in the bottom of the app. When a pick-up has been booked, the collector can see the state of the pick-up and change it until it has been planned by the logistics partner who conduct the pick-up. The data in the app is updated every 10th minute, however, data about the latest pick-up is updated every time the button to view the pick-up status is pressed. Data about the latest pick-up is shown in the form as long as it can be changed. When the pick-up has been planned by the logistics partner and can no longer be changed the form becomes empty and the collector can now book a new collection.

The amount of useful plastic a collector has collected is calculated as `complete amount of collected plastic / (reuseability percentage / 100)`. That means that if a collector has collected 50 kg plastic in a cluster with a reuseability percentage of 50 % he has collected 25 kg useful pastic. His personal progress is calculated based on the amount of useful pastic he has collected. Assuming the collector from the example from before has a collection goal of 100 kg, he'll have collected 25 % - `25kg/100kg = 0.25` - of his personal goal. Be aware that the circle with individual status is only only hvis an individual goal has been set for the collector. The progress of the entire circle is calculated in the same way. When calculating the progress of the entire circle, the total amount of useful pastic collected by all collectors is calculated - `total amount of collected plastic / (reuseability percentage / 100)` - and compared to the collection goal of the cluster which can be edited together with the other properties that belong to the cluster.

The app has a menu where the user can edit his profile, log out and see the privacy policy of the app. Users who aren't logged in can only access the privacy policy from the menu.

## Partnere

Partners only have access to the app via the web interface which can be accessed at [https://mytrash.houe.com](https://mytrash.houe.com).

The following type of partners exist: Administration partner, collection partner, logistics partner, reception partner and production partner. An administration partner can create new partners of all types. For now, a user can only be one type of partner. That means that if Houe as a company needs both an administration partner and a logistics partner, you'll have to create two users, one for each role. In the partner seleciton dropdown, the company name of the partner is shown.

As an escape hatch, partners can also be created directly without using the web interface which is described in depth in the technical section under the Azure AD B2c section. One scenario where this could become relevant is if the administration partner is deleted as it would then no longer be possible to create new partners through the web interface. The different partners have access to the following functionality:

The administration partner: Create partners and create clusters, access and edit all clusters, invite collectors to all collecter and delete collectors from all clusters, create and edit individual collection goals and change closed clusters to open and visa-versa. Be aware that the dropdown to select partners when creating a cluster works like the dropdown for selecting a cluster when creating a user in the app. This means that it only shows 5 results to begin with and will narrow down the options as the user types in the field. This means that the desired partner might not be shown until the results have been narrow down sufficiently by the user typing part of the name.

Collection partner: Access and edit the cluster the partner is associated to and add and remove collectors to/from this cluster, edit individual collection goals for collectors and close the cluster he's associated with. As such, the collection partner has access to a subset of the features that the administration partner has and is limited to only one specific cluster.

Logistics partner: Can see all pending pick-ups for her, plan these, edit their weight when they are collected and see whether their reception has been confirmed by the reception partner. The pick-ups the logistics partner can see include all the pick-ups that are booked for all the clusters in which she is added as a logistics partner and as such she works across clusters. If the logistics partner is removed from a cluster, she will retain the pick-ups that were booked for that cluster while she was still logistics partner for it, however, she will not see any future pick-ups booked within the cluster from which she has been removed. As in the app, it can take up to 10 minutes from a pick-up has been booked by the collector until it can be seen by the relevant logistics partner since the system is refetching data every teenth minute.

The reception partner: She can see and confirm receipt of the plastic that the logistics partner has delivered to her, create batches, mark batches as sent and see whether or not they have been confirmed received by the production partner. As such, the reception partner is also working across clusters as she is receiving plastic for all the clusters she is associated with. As with the logistics partner, the reception partner will stop receiving any more plastic from clusters that she is removed from but all the plastic she has already received from that cluster will still be associated with her. As with the logistics partner, it is possible that data can be delayed 10 minutes in her view.

Production partner: Can see and confirm receipt of the batches the reception partner has sent and can create products associatd to each batch and mark these products as sent. The production partner also works across clusters and receives batches for all the cluster she is associated with. As with the logistics partner and the reception partner, she will stop receiving future batches from a cluster she is removed from but still retain the batches she has already received from that cluster.

## What to be aware of as a user?

As mentioned several times, the system updates data every 10 minute and therefore, data can seem delayed if you are testing and as such know that something is going and therefore check immedidately. Ordinary users will not notice this in regular use, however, it is good to know as a superuser.

Users are shared across test and production environments. In the vast majority of cases, this does not have any implications, however, it means that the partners created in the test environment can also be seen in the production environment and visa-versa. Since partners can only be seen by the administrator this will not have a big impact, however, it is something to be aware of when testing.

All closed cluster and all data related to those is deleted 30 days after they are closed. This is also true for the collectors in the cluster, pick-ups associated with the cluster, batches associated within that cluster and products created within that cluster along with the cluster itself. The only thing that is not deleted with the cluster are the partners as these can be used on many different clusters and will potentially be used again in future clusters. A partner can be manually deleted through the Azure AD B2C interface which can be accessed through [https://portal.azure.com/](https://portal.azure.com/) 


## Prices

The system is hosted in Azure. In the following, an overview of the products used and the cost associated with these is provided

* Backend for production and test environments is hosted in Azure Function Apps on a serverless tier. A list of prices can be found on [https://azure.microsoft.com/en-us/pricing/details/functions/](https://azure.microsoft.com/en-us/pricing/details/functions/).
* User management is done via Azure AD B2C and the price is dependant on the amount of Monthly Active Users (MAUs). A list of prices can be found on [https://azure.microsoft.com/en-us/pricing/details/active-directory/external-identities/](https://azure.microsoft.com/en-us/pricing/details/active-directory/external-identities/).
* The databases for both produdction and test environments are hosted in Cosmos DB on a serverless tier. A list of prices can be found on [https://azure.microsoft.com/en-us/pricing/details/cosmos-db/](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/).
* The web interface is hosted in Azure Static Web Apps. A list of prices can be found on [https://azure.microsoft.com/en-us/pricing/details/app-service/static/](https://azure.microsoft.com/en-us/pricing/details/app-service/static/).
* A Log Analytics Workspace, two Applications Insights instances and a Storage Account have been created in order to support the two Azure Functions Apps (one for the test environment, one for the production environment) for the backend. Since these are only auxiliary products used by the function apps their contribution to the total hosting price should be negligible. 

# The system from a technical perspective

This section is aimed at developers and other tech-savy people who need to work with the system on a technical level. The solution is hosted at Houe's Azure in the tenant with id 17368d8c-b9ce-409c-ba95-ead421daaaa0 and domain houeb2c.onmicrosoft.com. For access contact Phillip at Houe or netIP who handles Azure for Houe.

## Azure AD B2C

All users, partners and collectors alike, are saved in and handled by Azure AD B2C. Azure AD B2C also handles login, edit of user profiles, password management ect. To handle individual collection goals and roles, the following custom attributes have been added to the AD in order to keep all data related to users in the AD.
To some extent, this is a matter of preference, however, I think it's nicer to have everything related to users in the AD instead of having a little bit of necessary user data lying around in the database when the majority of user management happens in Azure AD. 

<img width="1163" alt="CustomAttributes" src="https://user-images.githubusercontent.com/6885285/132017404-6d1eab7a-a8a8-4a59-8248-5e5e3c3592dd.png">

As custom attributes are a pain to work with through the portal interface (I'm actually not sure it is even possible as of this writing), the preferred way to add a new partner outside of the web interface is to issue a POST requet to https://func-houe-mytrash.azurewebsites.net/api/CreateCollaborator with a body like this.

```
{
	"firstName": "Louise",
	"lastName": "Mørk",
	"phoneNumber": "12345678",
	"email": "test@test.com",
	"companyName": "Houe",
	"street": "Rodelundsvej",
	"streetNumber": 4,
	"city": "Ry",
	"zipCode": 8680,
	"role": "Administrator" 
}
```

As you have probably guessed from the custom attributes, the valid values for role are: Administrator, CollectionAdministrator, LogisticsPartner, RecipientPartner and ProductionPartner. Adding collectors is done through a separate function and should not be necessary to do outside of the interface.

## Identity throughout the system

In MyTrash, we have three main entities that help us follow the plastic throughout its lifetime: Collection, batch, and product. In addition, we have another entity, Cluster, that ties everything together.

When a collector uses the MyTrash app, she books a collection of plastic. This creates a new (plastic) collection entity in the database which is linked to the cluster that the collector belongs as well as the LogisticsPartner and RecipientPartner in that cluster. When the LogisticsPartner schedules pick-up, registers pick-up and registers delivery the status of the collection changes. The status of the collection also changes once the RecipientPartner registers reception of the collection.

The RecipientPartner creates a batch. The batch is linked to the RecipientPartner who creates it, the cluster he belongs to and the ProductionPartner of that cluster. Be aware that the batch is NOT linked backwards to a Collection. Thus, we cannot determine which batches are made from which collections and therefore, we also cannot tell what specific collector contributed to the batch. Tracking-wise, the only thing we know about a batch is what Cluster it belongs to.

The Product is the final entity that is created. It's created for a specific batch and as such, it's linked to the ProductionPartner who creates it, the cluster he is in and the batch it was created from. We can go back in our tracking from Product to Batch but no further than that, as a batch is not linked to a Collection as just mentioned.

## Azure infrastructure and webdeployment

The folder Infrastructure contains ARM templates for most of the infrastructure and a file for deployment. It deploys and sets up the backends and databases but not the static web apps. As you can see, the Function Apps that host the backends need access to Microsoft Graph through a managed identity which is set up in the deployment.sh script. Although the script can be run, it's mostly meant for documentation and you can manually copy and paste individually commands to run the parts of it that you need.

Also, you need to be aware that the cosmos DB database with the mongo API needs indexes on certain collections, otherwise all endpoints that involve sorting will fail. This includes the `GetLatestCollection` endpoint which is critical for the functionality of the mobile app. The fields that need indexes are the following

For the collection named "Collection": 
```
CreatedAt
ScheduledPickupDate
DeliveryDate
ReceivedDate
```

For the collection named "Batch":
```
CreatedAt
SentDate
ReceivedDate
```

These can be created ahead of time even though the two collections do not yet have data. This is done by accessing the database either throug the portal or through a terminal by using the information in the connection string. Remember to add the `--tls` flag to the `mongo` command. An index is created by using the method documented at [https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/). 
In the latest update, these indexes  - along with indexes for all the foreign keys for performance - are generated in code the first time the database client is initialized, however, the above instructions have been left here as they still hold value as documentation into a vital aspect of the systems functionality.

Finally, remember to grant your static web app CORS access so it can access the backend through a web browser. You should also remember to add the URL of your static web app to approve redirect URLs in the Azure AD B2C, otherwise login and profile edit will fail for your URL. This is also true if you change the URL of an already deployed solution.

Deployment is done automatically through Github Actions. A push to develop will deploy to the test environment and a push to master will deploy to the production environment. Please be aware that you need to manually build and re-upload the apps for iOS and Android when deploying to production (see below). 

## Deployment of the mobile app

Everything regarding the mobile app is handled through Expo, see [https://expo.dev/](https://expo.dev/). Houe has an Expo account that Louise Mørk manages. Building for iOS is done through `npm run build:ios` and conversely for Android using `npm run build:android`. When building for iOS for the first time, contact Phillip at Houe as he owns the account that deploys the build to app store. The first time you build, you need to login to his account and he needs to approve you through 2FA.

The result of the build should be uploaded to App Store Connect at [https://appstoreconnect.apple.com/](https://appstoreconnect.apple.com/) for Apple and Google Play Store at [https://play.google.com/console/u/3/developers/?pli=1](https://play.google.com/console/u/3/developers/?pli=1) for Google. Phillip at Houe owns both accounts, so contact him for access. Note that development to production needs to be done manually as just described (as opposed to development to stagaing which happens automatically in the pipeline). Deployment via the CLI used to require a subscription and has therefore not been done, but should be done sometime in the future, see https://docs.expo.dev/distribution/uploading-apps/.

## The staging environment

The staging environment contains a separat cosmos db, function app, static web app and mobile apps that are deployed to the Expo Go app. It is completely isolated from production except for the fact that they use the same AD. The environment is controlled by the environment variable `APPLICATION_ENVIRONMENT`. The possible values include `local`, `staging` and `production`. Local should only be used when developing. It runs the application against a local backend and a local database. Please note that this will cause issues when debugging the mobile app on device unless you forward your localhost to something accessible from the mobile device using e.g. ngrok or similar. 
Staging runs the solution against the staging backend and database and should be used to issue pre-releases for test by Houe, if you want to test performance while developing or you don't want to make your localhost accessible to develop the mobile app. Production run the application against the production backend and database and should only be used when deploying the application. Also, the debug text on the login screen is hidden when the environment is production.

The staging environment can be access at [https://polite-field-0d14ffe03.azurestaticapps.net/](https://polite-field-0d14ffe03.azurestaticapps.net/) and the production environment can be access at [https://mytrash.houe.com](https://mytrash.houe.com) or [https://white-glacier-0780ea903.azurestaticapps.net/](https://white-glacier-0780ea903.azurestaticapps.net/) the former being an alias for the latter. The staging version of the app can be accessed by opening exp://exp.host/@houe/my-trash on a phone with Expo Go installed. It requires the user trying to access the app through Expo Go to be invited to the Houe Expo Account. 

