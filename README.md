# Entwicklung einer Anwendung zur Steuerung von kollaborationsaktivitäten in MS Teams (Office 365)

## Inhalt:

Dieses Repository enthält eine Anwendung zur Erhebung quantiativer Daten innerhalb von MS Teams (Office 365).
Die Anwendung baisert auf einer Drei-Schichten-Architektur und verwendet dafür den folgenden Technologie-Stack: 

* **ReactJS(GUI):**: React ermöglicht die einfache und effiziente Erzeugung von interaktiven User-Interfaces. React ermöglicht dabei das effektive Updaten und Rendern von Komponenten. Außerdem ermöglicht es durch seine Strukturierung den Code vorhersehbarer zu gestalten und die Fehlersuche zu vereinfachen. (https://reactjs.org/)

* **NodeJS/ExpressJS(Logik):**   
NodeJS ist eine Laufzeitumgebung, die das Ausführen von JavaScript Code außerhalb des Webbrowsers ermöglicht. In diesem Projekt wird es zum Ausführen des Webservers genutzt. (https://nodejs.org/en/) 
Express ist ein leistungsfähiges Node.js-Framework. Es stellt einige Funktionen von Webanwendungen bereit. Dabei sind vor allem die Möglichkeiten zur Erstellung von APIs und Webserverfunktionen für dieses Projekt relevant. (https://expressjs.com/de/)

* **MYSQL(Data):**: MySQL ist ein relationales Datenbankverwaltungssystem, welches im Projekt zur Speicherung der gesammlten quantitativen Daten genutzt wird. . (https://www.mysql.com/de/)

## Vorraussetzungen
- [NodeJS] Download und Installation von NodeJS: Link:  https://nodejs.org/en/

- [M365 developer account] oder Zugriff zu einem Teams Account mit den nötigen Rechten zum hinzufügen/installieren von Apps. 
  Mehr Infos unter: https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant

- [Statische Domain/Subdomain] zum Ausführen der Applikation innerhalb Teams.


## Domain konfigurieren / local tunneling

Zur Ausführung der Applikation innerhalb von Teams wird eine Domain mit staatischer IP-Adresse benötigt. 
Dazu kann die Applikation bei einen Cloud-Hoster gehostet werden. 
Falls eine statische IP-Adresse vorliegt, kann die Applikation auch ohne externen Provider gehostet werden. 

Eine Konfiguration zum Hosten der App innerhalb der Google Cloud Engine wird in der App.yaml beigelegt.
(Mehr Infos unter https://cloud.google.com/appengine?hl=de)

Zum Testen kann auch ein loker Tunnel mit einem Hashcode genutzt werden. (Mehr Infos unter https://localtunnel.github.io/www/)


## Installation, Start 

Das Projekt muss zunächst kopiert/geclont werden.

Zur Installation und Kofiguration aller Abhängigkeiten muss im Projekt der Befahlt `npm install` ausgeführt werden. 

Die Datenbankonfiguration ist unter ./server/index.js einzutragen. 

Bei Veränderung ReactJS-/GUI-Datein und vor dem ersten Start ist der Befehl `npm run-script build` auszuführen.

Der Start der Applikation erfolgt über den Befehl `npm start`.




## Attribution

All logos and images are from www.flaticon.com

## Referenzen

https://developer.microsoft.com/

https://docs.microsoft.com/

https://github.com/OfficeDev/microsoft-teams-library-js

https://docs.microsoft.com/en-us/microsoftteams/platform/overview

## Lizenz

Basierend auf einer adoptierten Lizenz von [Microsoft](https://github.com/OfficeDev/microsoft-teams-library-js
):

	Alle Datein auf dem teamsAppBelegarbeit Github Repository unterliegen der MIT license.

 
