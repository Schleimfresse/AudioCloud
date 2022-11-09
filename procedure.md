## IONICons für player adden [+]

## pushState fertigstellen [+]
-> Player 
- Zufallsmix [+]
- Soundregler [+]

- Sound icon [+]

- Volume mit local Storage verknüpfen [+]

- SHUFFLE & REPEAT [+]

- skip function [+]

- Playlist func 
 - in Db saven
 -> mit allen children als obj
  -> on use erstes usen und rest als list darstellen 
  -> /playlist endpoint adden 
  -> Account-icon adden [+]
  -> .js file umbennen [+]


-> Duration in liste einfügen [+]

## Backend kordinieren + erweitern
-> routes [+]
-> Lib [+]
-> server file saubern [+]


## settings
-> Audioqualität gut/schlecht 
-> Videos enablen & disablen [+]

## Player 
-> Video-controles 
-> currentSong bg change [+]

errors:
   shuffle -> pushState (click) -> shuffle: liste zeigt anderes item als spielt [+]

  Media [+]
   | |
   A V  - Audio + Video -> Media Prinzip
   -> const audio
   const video 
   let media

PiP through media
-> wird im only audio mode angezeigt -> icon [+]

- Input vergrößern -> icon etc

## BACKEND mp3 thubnails in quadrat schneiden <---------------######-


## sendFile() überarbeiten [+]

## suggestion press wird nicht als form submit initalisiert <----- [+]

- recent order mit $inc fixen -> database.find({ recent: { key: "recent" } }) fixen <- findet mit dieser Syntax nichts <-- [+]


- track wird nicht nach oben sortiert wenn angezeigter track angeclickt wird! kommt vom playlist (list) handler wenn möglich v & list mehr trennen randomized tracks track muss oben sein bei playlist nich

-> Verlauf \n
||
----> Zweite Database wenn Song -> fetch & add song [+]
----> bei Anfrage alle ausgeben
-> UI fixen [+]

-> Impress

-> Backend: Image überprüfen -> wenn image fill vorhanden und man added image -> error [+](Path "/public" missing)

-> Bug hunting

## User Auth and user sys

- UserAuth project beenden [+]
- UserAuth code intigrieren (noch nicht einbinden) [+]
- dann einbinden (soft) [+]
- frontend erstellen
  - neue file
  - restliche Seiten menu / nav changes
- frontend mit UserAuth verbinden

- ### UserAuth project im Folder lassen und als module adden? [positive, +]

root/UserAuth \
root/src/UserAuth

- src folder adden [+]
  - mit middleware
  - routes
  - lib
  - etc

  - app.use("/auth", UserAuth.userRoutes.router) versperrt zugang zu anderen Routern [+] (weirder Bug, hat sich von selbst behoben nachdem ich diese Notz verfasst habe) (läd manchmal sehr lange)
  - -> AudioCloud Router von Classen zu Objecten converten [+]

-> Ts convertierung [+]

.d.ts [I]
userAuth interface -> html, css, js (siehe Z.87) [+]

->  libary für Benutzer personalisieren [III]
 - Name auf allen Seiten im Menu anzeigen (middleware) [+]
 - Libary Profilpicture
 - login or logout status erkennen [+]

 -> on delete/edit searchHistory db updaten [II]

 -> verifyToken
 - nicht logged in auch reinlassen auf spzl. Seiten [soft] <-- überarbeiten -> causes infinite loop [middleware next() was missing] [+]
 - nicht einged in abblocken -> not logged in page [hard] [+]

 -> Email verify

 # FATAL Database seems not to work [database.loadDatabase() was not called [+]]

 -> profile
 -> login svg img
 -> menu btns verstecken wenn nicht eingelogged

# Project deployen -> Email server

Datei Upload via yt-link adden -> controller -> upload.mts
