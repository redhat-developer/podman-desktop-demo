# Pre-requisites

## Podman 5.0.1

Make sure to use Podman 5.0.1 or later.

## Podman Desktop 1.10.0

Make sure to install Podman Desktop 1.10.0 or later.

# Demo Script (without build of images)

In order to accelerate demo script, we'll use pre-built images from quay.io.

## Script

1. Open Podman Desktop

2. Install the Kind CLI

![install_kind](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/demo_install_kind.gif)

3. Create a new Rootful Podman Machine, having at least 4CPU and 10GB memory

![create_podman_machine](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/demo_create_podman_machine.gif)

4. Set up a Kind cluster and explain that we should take note of the HTTP port, as it will be used to customize our YAML file.

![create_kind_cluster](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/demo_create_kind_cluster.gif)

5. Show that there are specific sections dedicated to Kubernetes resources in Podman Desktop and we can leverage them when needed to check states, logs or interact with those resources

6. Explain briefly about the demo application we are going to use.

For this demo, we will be utilizing the Quarkus Super Heroes application. It is designed for superheroes to combat supervillains. The application comprises several microservices, communicating either synchronously via REST or asynchronously using Kafka. For a comprehensive understanding of the application and its microservices, refer to https://github.com/quarkusio/quarkus-super-heroes.

The app architecture

![application_architecture](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/application-architecture.png)

7. Explain that we need to update the value in the deployment YAML file of the React application to ensure it correctly utilizes the port mapped in Kind.

8. Show how we can push the changes to our cluster by using the 'Apply YAML' button.

![apply_yaml](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/demo_push_yaml.gif)

9. Navigate to the Deployments, Services, and Ingresses page to ensure that all resources are up and running.

10. Open the browser and connect using the port mapped by Kind.

11. Play with the application and show that everything works as explained before.

![app_running](https://github.com/redhat-developer/podman-desktop-demo/blob/main/kind-demo-super-heroes/assets/demo_app_running.png)

12. Go to the Pod containing the Fights DB and show that by using the terminal you can interact with the DB and update the value that will be shown by the UI

```
@fights-db-8bb9db5bf-wv8d2:/$ mongo -u super -p super      
MongoDB shell version v5.0.24
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("cca9a5d4-6fad-4181-a134-2900aecde549") }
MongoDB server version: 5.0.24
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================
---
The server generated these startup warnings when booting: 
        2024-04-18T12:40:04.867+00:00: The configured WiredTiger cache size is more than 80% of available RAM. See http://dochub.mongodb.org/core/faq-memory-diagnostics-wt
        2024-04-18T12:40:07.947+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
---

> use fights
switched to db fights

> show collections
Fights

> db.Fights.find()
{ "_id" : ObjectId("6621237ca09c6f6f5c647a24"), "fightDate" : ISODate("2024-04-18T13:43:24.847Z"), "location" : { "name" : "Endor", "description" : "Endor is a forested moon orbiting the gas giant planet of Endor in the Outer Rim Territories. The Ewok village, the Death Star shield generator bunker, and the lush forest terrain. Endor is the location of the Battle of Endor, a critical event in the Star Wars saga, where the Rebel Alliance defeated the Galactic Empire.", "picture" : "https://raw.githubusercontent.com/quarkusio/quarkus-super-heroes/characterdata/images/locations/endor.jpg" }, "loserLevel" : 7, "loserName" : "President John Keeler", "loserPicture" : "https://raw.githubusercontent.com/quarkusio/quarkus-super-heroes/characterdata/images/john-keeler-4384417850127763471.jpg", "loserPowers" : "Intelligence", "loserTeam" : "heroes", "winnerLevel" : 16000, "winnerName" : "Atraxa, Praetors' Voice", "winnerPicture" : "https://raw.githubusercontent.com/quarkusio/quarkus-super-heroes/characterdata/images/atraxa--2548839656340043085.jpg", "winnerPowers" : "Accelerated Healing, Acid Resistants, Angel Physiology, Cold Resistance, Corruption, Corruption Resistance, Cyborgization, Dark Magic, Electricity Resistance, Endurance, Energy Resistance, Enhanced Senses, Extrasensory Perception, Fire Resistance, Flight, Heat Resistance, Inorganic Physiology, Longevity, Magic Resistance, Multiple Limbs, Self-Sustenance, Status Effect Inducement, Substance Secretion, Toxin and Disease Resistance, Accelerated Development, Acid Manipulation, Agility, Air Control, Animal Control, Attack Negation, Attack Reflection, Curse Resistance, Damage Reduction, Durability Negation, Electrokinesis, Element Control, Energy Blasts, Energy Manipulation, Fear Inducement, Force Fields, Gadget Usage, Gliding, Hellfire Resistance, Holy Manipulation, Holy Resistance, Hope Inducement, Illumination, Illusion Resistance, Indomitable Will, Intuitive aptitude, Invulnerability, Levitation, Light Control, Magic, Marksmanship, Mechanical Aptitude, Metal Manipulation, Mind Control Resistance, Natural Armor, Natural Weapons, Necromancy, Non-Physical Interaction, Organic Manipulation, Plant Control, Possession Resistance, Power Nullifier, Psionic Powers, Reflexes, Regeneration Negation, Resurrection, Soul Manipulation, Soul Resistance, Statistics Amplification, Statistics Reduction, Telepathy Resistance, Toxin and Disease Control, Umbrakinesis, Unholy Manipulation, Unholy Resistance, Vaporising Beams, Water Control, Weapon-based Powers, Wind Control, Aura, Blood Manipulation, Curse Manipulation, Damage Transferal, Death Manipulation, Death Touch, Energy Absorption, Energy Constructs, Illusions, Immortality, Information Analysis, Large Size, Life Manipulation, Magic Absorption, Master Tactician, Melting, Power Augmentation, Power Bestowal, Preparation, Purification, Telepathy, Weapons Master", "winnerTeam" : "villains" }

> db.Fights.update({"_id":  ObjectId("6621237ca09c6f6f5c647a24")}, {$set: {"winnerName": "luca"}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> 
```