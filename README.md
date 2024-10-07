# Chasse aux trésors

Pour lancer la chasse aux trésors, vous devez :

- ajouter le fichier d'entrée dans le répertoire
- exécuter la commande suivante :

```bash
npx tsx src/index.ts test.txt
```

(En remplaçant test.txt par le nom de votre fichier).

Si le fichier d'entrée n'est pas dans le répertoire du projet, vous devrez spécifier le path vers ce fichier à la place du nom.

Une fois la commande exécutée, un fichier de sortie nommé 'treasureHuntResult.txt' sera généré dans le répertoire. Ce dernier contient les résultat de la chasse aux trésors.

## Points limitants :

Je n'ai pas réussi à désactiver la compilation on save donc il faut supprimer le répertoire dist dans src/test avant de lancer les tests après les avoir modifiés.

Je n'ai pas trouvé de moyen de tester les fonctions qui ne sont pas appelées dans l'index.js sans les exporter mais ces dernières auraient dû rester privées (et donc ne pas être exportées car elles ne sont utilisées que dans le fichier dans lequel elles sont définies).
