# The system from a user perspective 

This section describes how the system work, what it does nad how it is used. It's aimed at ordinary users and super users and can be used as a reference when there's any need for support or any doubt about the functionality of it. This is written for version 1 of MyTrash

## Collectors

The collectors are the customers who collect plastic. They only have access to the system through the mobile app which can be accessed on Apple's App  Store or Google's Play store. Collectors can sign up in the app by pressing "create user" on the start screen of the app. Here, collectors can sign up to one of the open clusters that are accessible in the app. In the dropdown, five clusters are shown at a time and the clusters shown will be filtered when the user types which means the desired cluster might not be shown before the list has been sufficiently filtered.

In addition, a collector can be created manually by an administrator or a collection administrator and assigned to an arbitrary cluster. A collector can also sign up for closed clusters manually through the invitation link that is shown in the administrator and collection administrator interfaces underneath each closed cluster. Be aware that everybody with this link can sign up to the closed cluster which the link belongs to.

Every collector is associated with exactly one cluster, never more and never less. Collectors are automatically deleted together with the cluster they belong to and the data in that cluster 30 days after the cluster has been closed.

When the collector has signed up, he can se the progress of his own collection. He can also see the collection progress of the cluster as a whole if the cluster is a closed cluster. In addition, a collector can book a pick-up of his pastic and access various information through the buttons in the bottom of the app. When a pick-up has been booked, the collector can see the state of the pick-up and change it until it has been planned by the logistics partner who conduct the pick-up. The data in the app is updated every 10th minute, however, data about the latest pick-up is updated every time the button to view the pick-up status is pressed. Data about the latest pick-up is shown in the form as long as it can be changed. When the pick-up has been planned by the logistics partner and can no longer be changed the form becomes empty and the collector can now book a new collection.

The amount of useful plastic a collector has collected is calculated as `complete amount of collected plastic / (reuseability percentage / 100)`. That means that if a collector has collected 50 kg plastic in a cluster with a reuseability percentage of 50 % he has collected 25 kg useful pastic. His personal progress is calculated by compared 

Den mængde brugbar plast en indsamler har indsamlet udregnes som `totalt indsamlet plast / (genanvendelsesprocent / 100)`. Dvs, hvis en indsamler har indsamlet 50 kg plast i et cluster, hvor genanvendelsesprocenter er 50 %, så har han indsamlet 25 kg brugbar plast. Hans personlige fremgang udregnes, ved at holde den indsamlede mængde brugbar plast op mod det mål der er sat for ham. I eksemplet fra før, så vil han med et personligt mål på 100 kg se en individuel status på `25kg/100kg = 0.25`, altså 25 %. Læg mærke til at cirklen med individuel status kun kan vises, hvis der er sat et individuelt mål for indsamleren. Status for cirklen udregnes på samme måde. Her lægges mængde af brugbart plast (`totalt indsamlet plast / (genanvendelsesprocent / 100)`) sammen for alle indsamlere i clusteret og dette holdes op mod clusterets indsamlingsmål, som kan sættes og redigeres sammen med de andre egenskaber, der hører til et cluster.

App'en har en menu hvorfra brugeren kan redigere sin profil, logge ud og se app'en privatlivspolitik. Er brugeren ikke logget ind er det kun privatlivspolitiken der kan ses fra menuen.

## Partnere

Partnere har kun adgang til app'en via webinterfacet, som tilgås på [https://mytrash.houe.com](https://mytrash.houe.com).

Der findes følgende partnertyper: Administrationspartner, indsamlingspartner, logistikpartner, modtagerpartner og produktionspartner. En administrationspartner kan oprette nye partnere af alle disse typer. For nu kan en bruger kun være en type partner, så hvis Houe f.eks. har brug for en administrationpartner og en logistikpartner skal jeg oprettes to brugere, en for hver rolle. I partner dropdowns vises partnerens virksomhedsnavn.

Under sektionen omkring Azure AD B2C i det tekniske afsnit beskrives, hvordan partnere kan oprettes direkte udenom webinterfacet. Dette kan f.eks. blive relevant, hvis alle administrationspartnere er blevet slettet, da det så ikke er muligt at oprette en administrationspartner igennem webinterfacet. De forskellige partnere har adgang til følgende funktionalitet:

Administrationspartner: Oprette partnere og oprette clustre, tilgå alle clustre og redigere disse, invitere indsamlere til dem, slette indsamlere fra dem, oprette og ændre individuelle indsamlingsmål samt lukke åbne clustre og åbne lukkede clustre. Vær opmærksom på, at dropdown'en til valg af partnere fungerer som dropdown'en til valg af clustre ved oprettelse af bruger i app'en. Den viser således kun 5 resultater til en start og indsnævrer valgmulighederne, når der skrives i feltet, hvorfor den ønskede partner ikke nødvendigvis vises før listen er snævret tilstrækkeligt ind.

Indsamlingspartner: Tilgå og redigere det cluster, som partneren er knyttet til samt tilføje indsamlere til clusteret, slette indsamlere fra clusteret, redigere indsamlernes individuelle indsamlingsmål og lukke clusteret. Indsamlingspartneren har således adgang til et subset af administraionspartnerens funktionalitet for et enkelt cluster.

Logistikpartner: Kan se alle de afhentninger der venter på ham, planlægge disse, redigere vægten når de hentes og følge med i, om de bekræftes hos modtagerpartneren. De afhentninger logistikpartneren kan se er alle de afhentninger der er booket i alle clustre, som partneren er sat som logistikpartner på og han arbejder således på tværs af clustre. Hvis logistikpartneren fjernes fra et eksisterende cluster vil have beholde de afhentninger der blev booket i clusteret mens han var logistikpartner på det, men ikke få fremtidige afhentninger fra det cluster. Som i app'en kan der gå op til 10 minutter fra en afhentning bookes i app'en til den kan ses af logistikpartneren, da systemet kun spørger efter data hvert 10 minut.

Modtagerpartner: Kan se og bekræfte modtagelse af de afhentninger logistikpartneren har afleveret, oprette batches og afsende disse og følge op på, at de bliver bekræftet modtaget hos produktionspartneren. Modtagerpartneren arbejder også på tværs af clustre og modtager afhentninger for alle de clustre, som partneren er tilknyttet. Ligesom med logistikpartneren stopper modtagerpartneren med at modtage afhentninger fra et cluster fremadretet, hvis partneren fjernes fra clusteret, men beholder dem, der allerede er afleveret. Som med logistikpartneren kan der gå op til 10 minutter fra en afhentning afsendes til den kan ses hos logistikpartneren.

Produktionspartner: Kan se og bekræfte modtagelse af de batches modtagerpartneren har sendt og kan oprette produkter under hvert batch samt markere disse produkter som afsendt. Produktionspartneren arbejder også på tværs af clustre og modtager batches for alle de clustre, som partneren er tilknyttet til. Ligesom med logistik- og modtagerpartner stopper produktionspartneren med at modtage batches fra et givent cluster fremadretet, hvis partneren fjernes fra det cluster, men beholder de batches han har modtaget fra clusteret indtil da.

## Hvad skal du som bruger være opmærksom på?

Som nævnt flere gange henter systemet kun data hvert 10 minut, og data kan således fremstå "forsinket", hvis man ved der skal komme noget og man sidder og tjekker med det samme. Dette vil ikke være noget almindelige brugere ligger mærke til i dagligt brug, men det er godt at vide som superbruger.

Brugere deles på tværs af test og produktionsmiljø. I langt de fleste tilfælde har dette ikke nogen betydning, dog betyder det, at de partnere man givetvis opretter i testmiljø også kan ses på produktionsmiljøet. Da partnerne kun kan ses af administratorer har dette ikke den store betydning, men det er noget man skal have in mente, når man tester.

Alle lukkede clustre og data relateret til disse slettes 30 dage efter, de er lukkede. Dette gælder både indsamlerne i clusteret, indsamlingerne registreret til clusteret, batches oprettede under clusteret og produkter oprettet under clusteret samt, selvfølgelig, selve clusteret. Det eneste relateret til clusteret der ikke slettes er partnerne, da disse
kan gå igen på tværs af mange forskellige clustre. En partner slettes manuelt via Azure AD B2C som kan tilgås via [https://portal.azure.com/](https://portal.azure.com/) sammen med alt andet, der ligger i Azure. NetIP kan supportere og vejlede omkring alt, hvad der ligger i Azure.

## Priser

Systemet hostes i Azure. I det følgende gives et overblik over, hvilket abstraktioner der benyttes og hvad disse koster.

* Backend til produktions- og testmiljø hostes i Azure Function Apps på et serverless tier. En prisliste kan findes på [https://azure.microsoft.com/en-us/pricing/details/functions/](https://azure.microsoft.com/en-us/pricing/details/functions/).
* Brugerstyring klares af Azure AD B2C og prisen her er afhængig af Monthly Active Users (MAUs). En prisliste kan findes på [https://azure.microsoft.com/en-us/pricing/details/active-directory/external-identities/](https://azure.microsoft.com/en-us/pricing/details/active-directory/external-identities/).
* Databaserne til produktions- og testmiljøet hostes i Cosmos DB på et serverless tier. En prisliste kan findes på [https://azure.microsoft.com/en-us/pricing/details/cosmos-db/](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/).
* Webinterfacet hostes i Azure Static Web Apps. En prisliste kan findes på [https://azure.microsoft.com/en-us/pricing/details/app-service/static/](https://azure.microsoft.com/en-us/pricing/details/app-service/static/).
* Til at understøtte de to Azure Function Apps til backenden er der oprettet et Log Analytics Workspace, to Applications Insights instanser samt en Storage Account. Disse bruges ikke af andet end de to Azure Function Apps og derfor burde de ikke have noget bidrage af betydning til den samlede hostingpris.

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

