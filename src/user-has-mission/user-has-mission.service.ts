import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserHasMissionDto } from './dto/create-user-has-mission.dto';
import { UpdateUserHasMissionDto } from './dto/update-user-has-mission.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserHasMissionService {

  constructor(private readonly prisma: PrismaService) { }


  //La méthode reçoit deux choses : le DTO (qui ne contient que slotId, envoyé par le front) 
  //et userId (qui viendra du token dans le controller, jamais du body — comme creatorId sur les missions).
  async create(createUserHasMissionDto: CreateUserHasMissionDto, userId: number) {

    //On charge le slot avec ses inscriptions existantes (include: { userHasMissions: true }). 
    //C'est indispensable pour les deux vérifications suivantes — sans ça, on ne sait ni qui est déjà inscrit, ni combien de places sont prises.
    const slot = await this.prisma.missionSlot.findUnique({
      where: { id: createUserHasMissionDto.slotId },
      include: { userHasMissions: true }
    })

    if (!slot) {
      throw new NotFoundException(`MissionSlot ${createUserHasMissionDto.slotId} not found`)
    }

    //Array.some() retourne true dès qu'il trouve au moins un élément qui correspond à la condition. 
    //Ici : "est-ce qu'il existe déjà une inscription où userId correspond à celui qui veut s'inscrire ?" 
    //Si oui → ConflictException (code HTTP 409, "ressource déjà existante").

    // Vérifie que le user n'est pas déjà inscrit sur ce slot
    const alreadyRegistered = slot.userHasMissions.some(uhm => uhm.userId === userId)
    if (alreadyRegistered) {
      throw new ConflictException('Vous êtes déjà inscrit sur ce créneau')
    }

    //userHasMissions.length = nombre de personnes actuellement inscrites. 
    //Si ce nombre est supérieur ou égal à max_volunteers → plus de place. BadRequestException = code HTTP 400 "requête invalide".

    //Vérifie qu'il reste de la place
    if (slot.userHasMissions.length >= slot.max_volunteers) {
      throw new BadRequestException('Ce créneau est complet')
    }


    // Si les deux vérifications passent, on crée la ligne dans User_Has_Mission. 
    // On inclut user et slot dans la réponse pour que le front reçoive les infos complètes (nom du bénévole, détails du slot) et pas juste les ids.
    return this.prisma.user_Has_Mission.create({
      data: {
        userId,
        slotId: createUserHasMissionDto.slotId
      },
      include: {
        user: {
          omit: {
            email: true,
            password: true
          }
        },
        slot: true
      }
    })
  }



// Toutes les inscriptions d'un utilisateur donné. On inclut le slot et la mission du slot, pour que le front 
// puisse afficher "tu es inscrit sur le créneau samedi 9h-12h de la mission Buvette". Sans cet include imbriqué, tu n'aurais que des ids.

  async findAllByUser(userId: number) {
    return this.prisma.user_Has_Mission.findMany({
      where: {userId},
      include: {
        slot: {
          include: {mission: true}
        }
      }
    })
  }


  // Tous les bénévoles inscrits sur un slot précis. Utile pour afficher dans la modale "qui est déjà inscrit sur ce créneau" — ou 
  // pour un admin qui veut voir la liste des inscrits.
  async findAllBySlot(slotId: number) {
    return this.prisma.user_Has_Mission.findMany({
      where: {slotId},
      include: {
        user: {
          omit: {
            email: true,
            password: true
          }
        }
        }
      }
    )
  }




  // La méthode reçoit 4 paramètres : le slot concerné, le user à désinscrire, et les infos de 
  // celui qui fait la demande (son id et son rôle) — pour vérifier s'il a le droit.
  async remove(slotId: number, userId: number, requesterId: number, requesterRole: string) {

    // userId_slotId est le nom de la clé composite générée par Prisma depuis @@id([userId, slotId]) dans le schema. 
    // Il faut fournir les deux pour identifier une ligne de façon unique. Si la ligne n'existe pas → NotFoundException.
    const registration = await this.prisma.user_Has_Mission.findUnique({
      where: {userId_slotId: {userId, slotId}}
    })

    if(!registration) {
      throw new NotFoundException('Inscription introuvable')
    }


    //Règle de permission : si pas admin et qu'on essaies de désinscrire quelqu'un d'autre que toi → refusé. Un bénévole peut se désinscrire lui-même (requesterId === userId), un admin peut désinscrire n'importe qui. Même logique que le DELETE dans UserController qu'on avait vu plus tôt.

    if(requesterRole !== 'admin' && requesterId !== userId) {
      throw new ForbiddenException('Action non autorisée')
    }

    // Suppression de la ligne. Pas de return ici — comme dans remove() de tes autres services, 
    // on supprime et c'est tout, la méthode retourne void implicitement.
    await this.prisma.user_Has_Mission.delete({
      where: {userId_slotId: {userId, slotId}}
    })
  }
}
