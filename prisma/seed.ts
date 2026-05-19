import 'dotenv/config'
import { error, log } from "console";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";
import * as argon2 from 'argon2'



const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string)
const prisma = new PrismaClient({ adapter }) // crée une connexion à la base de données


const skillsName: string[] = [
    "Organisation",
    "Communication",
    "Animation",
    "Réseaux sociaux",
    "Arbitrage",
    "Premiers secours",
    "Accueil des participants",
    "Photographie",
    "Gestion du budget",
    "Logistique évènementielle",
    "Gestion du matériel"
]


// fonction qui insère les données
async function main() {

    await prisma.evnt.deleteMany()
    await prisma.user_has_Skill.deleteMany()
    await prisma.user.deleteMany()
    await prisma.skill.deleteMany()
    

    //1 - création des compétences 

    // Promise.all permet de lancer la création de tous les skills en même temps au lieu des uns après les autres
    await Promise.all(
        skillsName.map((name) =>
            prisma.skill.upsert({
                where: { name }, // Grâce au @unique
                update: {},      // Si ça existe déjà, on ne change rien
                create: { name: name } // Si ça n'existe pas on le crée
            })
        )
    )

    // 2 - Création de deux utilisateurs de base


    const hashedPassword1 = await argon2.hash("Lmpd!123")
    const hashedPassword2 = await argon2.hash("123!Mdp")

    const user1 = await prisma.user.create({
        data: {
            firstname: "Momo",
            lastname: "Lepetitchat",
            email: "momo@email.com",
            password: hashedPassword1,
            date_of_birth: new Date("1993-10-23"),
            role: "benevole",
            isOnboarded: false,
            mustChangePassword: true
        }
    })

    const user2 = await prisma.user.create({
        data: {
            firstname: "Admin",
            lastname: "istrateur",
            email: "admin@email.com",
            password: hashedPassword2,
            date_of_birth: new Date("1993-10-23"),
            role: "admin",
            isOnboarded: true,
            mustChangePassword: false
        }
    })

    const skills = await prisma.skill.findMany({take : 2})

    await prisma.user_has_Skill.createMany({
        data: skills.map(skill => ({
            userId: user2.id,
            skillId: skill.id
        }))
    })


    // 3 - Création d'une catégorie

    const category1 = await prisma.category.upsert({
        where: { name: "Tournoi" },
        update: {},
        create: { name: "Tournoi" }
    })


    // 4 - Création d'un évènement

    const event1 = await prisma.evnt.create({
        data: {
            name: "Le petit tournoi des familles",
            description: "Premier tournoi où petits et grands peuvent venir s'amuser en famille",
            date: new Date("2026-06-15"),
            start_hour: new Date("1970-01-01T09:00:00"),
            end_hour: new Date("1970-01-01T18:00:00"),
            categoryId: category1.id,
            creatorId: user1.id
        }
    })



    console.log("Seed terminé avec succès !");

}

main()
    .catch(console.error) // traitement de l'erreur
    .finally(async () => {
        await prisma.$disconnect()
    }) // fermeture de la connexion à la base quand tout est terminé