# Beeround
Find the best rated beers close to your geo location.

<h2>Installation:</h2>
<h4>1. Gehe zum root Ordner, wo die App installiert werden soll und lasse im Terminal folgenden Befehl laufen:</h4> 
npm install -g cordova ionic

<h4>2. Clone das git repositoy in den Ordner, wo die App installiert werden soll und lasse den Befehl laufen: </h4>
git clone https://github.com/beeround/beeround.git 

<h4>3. Wechsele in den Ordner wo git hinein geklont wurde und lasse npm laufen: </h4>
cd beeround <br />
npm install 

<h4>4. Installiere das Google Chrome plugin: </h4>
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi 

<h4>5. Um den Server zu starten: </h4> <br />
ionic serve --address localhost

<h5>Sollte ein Fehler bezüglich einem fehlendem gulpfile kommen, lasse folgende Befehle laufen: </h5> 
npm updat <br />
npm remove gulp-sass <br />
npm install gulp-sass --save-dev 

<h5>Den aktuellen Stand aus GIT runter ziehen (Vorsicht: Server vorher stoppen):</h5> 
git pull

<h5>Server stoppen auf Windows: </h5>
Strg + C <br />
Yes

<h5>Browser: </h5>
Google Chrome