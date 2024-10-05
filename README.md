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
