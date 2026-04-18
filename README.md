# club-genai-mcp

Ceci est un repository contenant toutes les informations nécessaires au déroulement de la session GenEI Sphere de mars 2026 sur les MCP.
L'objectif est de réaliser une présentation et des exercices pratiques sur l'écriture et le fonctionnement des MCP au cours d'une soirée d'un format d'une heure et demie environ.

Ce repository contient les exercices et livrables ainsi qu'une version solution des réalisations telles qu'elles doivent être effectuées par les personnes présentes lors de la session.
Support de la présentation : https://t0sa.github.io/club-genai-mcp/

## Déroulé de la session

- Théorie (15min)
- Pratique
  1. Comment utiliser un MCP (15min)
  - Via IA aller chercher un agent.md pour les règles de code du second exercice
  2. Développer un MCP
  - Server (20min)
  - Client (20min)

- Conclusion (5min)

## Livrables à préparer

- Agent.md
- API + Front
- Soluce MCP Client Server

### Utilisation d'un MCP: récupération d'un fichier Agent.md

Dans cette première phrase, les participants vont devoir aller chercher un fichier agent.md présent sur ce repository via MCP afin de pouvoir avancer dans les phases suivantes.
L'objectif est d'utiliser pour cela le MCP GitHub.
le fichier doit être suffisamment générique pour être utilisable par n'importe quel agent et aura les règles suivantes:

- Après chaque modification, le code doit être rebuild pour vérifier que tout compile bien.
- Après chaque modification, les tests correspondants doivent être écrits.
- Après chaque modification, les tests doivent être lancés pour vérifier qu'ils passent tous bien correctement et qu'il n'y a pas eu de régression.
- Après chaque modification, un outil de linting adapté doit être utilisé pour vérifier la qualité de code.
- Après chaque modification, vérifier la présence d'un fichier README.md et d'un .gitignore à la racine du projet. S'ils sont absents, les créer avec des valeurs par défaut adaptées.
- Après chaque modification, expliquer de manière compréhensible au participant ce qui a été fait et dans quel but.

### Développement d'un MCP

Maintenant qu'ils ont récupéré l'agent.md via le MCP GitHub, les participants doivent développer un serveur et un client MCP.
Est mise à leur disposition une API depuis laquelle ils doivent envoyer ou chercher des informations avec les routes suivantes:

- GET all
- GET one (latest)
- POST

```json
{
  "pseudo": "string",
  "nom de tache": "string",
  "avancement de la tache": "string"
}
```

Cette API tourne dans la pièce où se passe l'exercice et est disponible via une IP qui sera fournie le jour J.
De plus, un front permettant d'afficher les dernières informations postées dans l'API sera affiché dans la pièce afin de voir l'évolution de l'exercice.
Celui-ci ne tourne qu'à titre indicatif avec un refresh automatique toutes les deux secondes afin de récupérer le GET all de l'API.

L'objectif des participants est de créer un serveur puis un client MCP qui va aller en fonction des demandes à l'IA, récupérer tout ou un message sur l'API ou poster son propre message.
