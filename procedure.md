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

-> bei edit werden die searchHistory ergebnisse nicht editiert

-> Impress

-> Backend: Image überprüfen -> wenn image fill vorhanden und man added image -> error [+] (Path "/public" missing)