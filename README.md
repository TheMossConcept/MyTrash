# Systemet fra et brugerperspektiv

Denne sektion beskrives, hvordan systemet virker, hvad det kan og hvordan det skal bruges. Den er rette mod almindelige brugere og superbrugere og kan bruges som reference, når der er behov for support eller tvivl i forhold til funktionaliteten. Dette er skrevet til version 1 af MyTrash.

## Indsamlere

Indsamlere har kun adgang til løsningen gennem mobilapp'en, som kan tilgås via Apples App Store eller Google Play Store. Indsamlere kan oprette sig i app'en ved at trykke "Opret bruger" på app'ens startskærm. Her kan indsamleren oprette sig i et af de åbne clustre, der er tilgængelige i app'en. I dropdown'en vises 5 clutre ad gangen og valgmulighederne indsnævres, når der bliver skrevet i feltet, det ønskede cluster vises således ikke nødvendigvis før listen er indsnævret til få nok muligheder.

En indsamler kan også oprettes manuelt af en administrator eller indsamlingsadministrator i et hvilket som helst cluster. Endelig kan indsamlere selv oprette sig i et lukket cluster gennem det invitationslink, der vises i administrator- eller indsamlingsadministratorinterfacet ved lukkede clustre. Alle med dette link kan oprette sig i det lukkede cluster, som linket hører til.

Enhver indsamler er knyttet til præcist et cluster, aldrig flere og aldrig færre. Indsamlerne slettes sammen med clusteret og dets data 30 dage efter clusteret er lukket.

Når indsamleren er oprettet kan vedkommende se status på sin egen individuelle indsamling og på clusterets indsamling, hvis indsamleren er knyttet til et lukket cluster. Derudover kan indsamleren booke en afhentning eller tilgå forskellige informationer via knapperne i bunden. Når en afhentning bookes kan indsamleren se status på denne samt rette den, indtil den bliver planlagt af logistikpartneren. Data i app'en opdateres hvert 10 minut, men data omkring den seneste indsamling opdateres hver gang der trykkes på knappen for at se indsamlingsstatus. Data for den seneste indsamling vises i formen så længe denne kan rettes. Når den er planlagt og ikke længere kan rettes bliver formen tom og indsamleren kan nu booke en ny indsamling. Når der bookes en ny indsamling er det status for denne der ses i app'en og status for den forrige indsamling kan ikke længere ses.

App'en har en menu hvorfra brugeren kan redigere sin profil, logge ud og se app'en privatlivspolitik. Er brugeren ikke logget ind er det kun privatlivspolitiken der kan ses fra menuen.

## Partnere

Partnere har kun adgang til app'en via webinterfacet, som i øjeblikket kan tilgås på [https://white-glacier-0780ea903.azurestaticapps.net/login](https://white-glacier-0780ea903.azurestaticapps.net/login). Planen er at løsningen skal flyttes til mytrash.houe.com, når domænevalideringen går i orden med Tony fra TC Systems, som står for administration af domænet houe.com.

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

## Priser

Systemet hostes i Azure. I det følgende gives et overblik over, hvilket abstraktioner der benyttes og hvad disse koster.

* Brugerstyring klares af Azure AD B2C og prisen her er afhængig af Monthly Active Users (MAUs). En prisliste kan findes [her](https://azure.microsoft.com/en-us/pricing/details/active-directory/external-identities/).
* Backend til produktions- og testmiljø hostes i Azure Function Apps på et serverless tier. En prisliste kan findes [her](https://azure.microsoft.com/en-us/pricing/details/functions/).
* Webinterfacet hostes i Azure Static Web Apps. En prisliste kan findes [her](https://azure.microsoft.com/en-us/pricing/details/app-service/static/).
* Databaserne til produktions- og testmiljøet hostes i Cosmos DB på et serverless tier. En prisliste kan findes [her](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/).
* Til at understøtte de to Azure Function Apps til backenden er der oprettet et Log Analytics Workspace, to Applications Insights instanser samt en Storage Account. Disse bruges ikke af andet end de to Azure Function Apps og derfor burde de ikke have noget bidrage af betydning til den samlede hostingpris.

# The system from a technical perspective

This section is aimed at developers and other tech-savy people who need to work with the system on a technical level. The solution is hosted at Houe's Azure in the tenant with id 17368d8c-b9ce-409c-ba95-ead421daaaa0 and domain houeb2c.onmicrosoft.com. For access contact Phillip at Houe or netIP who handles Azure for Houe.

## Azure AD B2C

All users, partners and collectors alike, are saved in and handled by Azure AD B2C. Azure AD B2C also handles login, edit of user profiles, password management ect. To handle individual collection goals and roles, the following custom attributes have been added to the AD

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

These can be created ahead of time even though the two collections do not yet have data. This is done by accessing the database either throug the portal or through a terminal by using the information in the connection string. Remember to add the `--tls` flag to the `mongo` command. An index is created by using [this method](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/).

Finally, remember to grant your static web app CORS access so it can access the backend through a web browser. You should also remember to add the URL of your static web app to approve redirect URLs in the Azure AD B2C, otherwise login and profile edit will fail for your URL. This is also true if you change the URL of an already deployed solution.

Deployment is done automatically through Github Actions. A push to develop will deploy to the test environment and a push to master will deploy to the production environment. Please be aware that you need to manually build and re-upload the apps for iOS and Android when deploying to production (see below). 

## Deployment of the mobile app

Everything regarding the mobile app is handled through [Expo](https://expo.dev/). Houe has an Expo account that Louise Mørk manages. Building for iOS is done through `npm run build:ios` and conversely for Android using `npm run build:android`. When building for iOS for the first time, contact Phillip at Houe as he owns the account that deploys the build to app store. The first time you build, you need to login to his account and he needs to approve you through 2FA.

The result of the build should be uploaded to [App Store Connect](https://appstoreconnect.apple.com/) for Apple and [Google Play Console](https://play.google.com/console/u/3/developers/?pli=1) for Google. Phillip at Houe owns both accounts, so contact him for access.

## The staging environment

The staging environment contains a separat cosmos db, function app, static web app and mobile apps that are deployed to the Expo Go app. It is completely isolated from production except for the fact that they use the same AD. The environment is controlled by the environment variable `APPLICATION_ENVIRONMENT`. The possible values include `local`, `staging` and `production`.
