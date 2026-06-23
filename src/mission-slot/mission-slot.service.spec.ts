import { Test, TestingModule } from '@nestjs/testing';
import { MissionSlotService } from './mission-slot.service';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';



describe('MissionSlotService', () => {
  let service: MissionSlotService;
  let prisma: PrismaService;

  // Mock de PrismaService : on remplace les vraies méthodes par des fonctions factices
  const mockPrismaService = {
    missionSlot: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createMany: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionSlotService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<MissionSlotService>(MissionSlotService);
    prisma = module.get<PrismaService>(PrismaService);
  });


  // remet les mocks à zéro entre chaque test
  afterEach(() => {
    jest.clearAllMocks()
  })



  describe('create', () => {

    it('devrait créer un slot et renvoyer le résultat', async () => {

      // 1 - ARRANGE : prépare les données du test
      const dto = {
        date: new Date('2026-01-01'),
        start_hour: '09:00',
        end_hour: '12:00',
        max_volunteers: 3,
        missionId: 5
      }

      const expectedSlot = {
        id: 1,
        date: dto.date,
        start_hour: new Date(`1970-01-01T${dto.start_hour}:00`),
        end_hour: new Date(`1970-01-01T${dto.end_hour}:00`),
        max_volunteers: dto.max_volunteers,
        missionId: dto.missionId
      }

      // 2 - dis au mock quoi renvoyer quand create() sera appelé
      mockPrismaService.missionSlot.create.mockResolvedValue(expectedSlot)

      // 3 - ACT : appelle la vraie methode du service
      const result = await service.create(dto)


      // 4 - ASSERT : vérifie le résultat en comparant result et les données de expectedSlot.
      expect(result).toEqual(expectedSlot)


      // Cette nouvelle ligne vérifie précisément ce que le service a réellement envoyé à prisma.missionSlot.create(...) — donc si jamais quelqu'un cassait la transformation des dates dans le vrai code du service, ce test échouerait et nous préviendrait.
      expect(mockPrismaService.missionSlot.create).toHaveBeenCalledWith({
        data: {
          date: dto.date,
          start_hour: new Date(`1970-01-01T${dto.start_hour}:00`),
          end_hour: new Date(`1970-01-01T${dto.end_hour}:00`),
          max_volunteers: dto.max_volunteers,
          missionId: dto.missionId
        }
      })
    });

  })


  describe('findOne', () => {

    it('devrait renvoyer un créneau', async () => {


      const expectedSlot = {
        id: 1,
        date: new Date('2026-01-01'),
        start_hour: '09:00',
        end_hour: '12:00',
        max_volunteers: 3,
        missionId: 5
      }

      // 2 - dis au mock quoi renvoyer quand findUnique() sera appelé
      mockPrismaService.missionSlot.findUnique.mockResolvedValue(expectedSlot)

      // 3 - ACT : appelle service.findOne(1)
      const result = await service.findOne(expectedSlot.id)

      // 4 - ASSERT : vérifie result, et vérifie que findUnique a été appelé avec le bon "where"
      expect(result).toEqual(expectedSlot)
      expect(mockPrismaService.missionSlot.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          mission: true,
          userHasMissions: {
            include: {
              user: {
                omit: {
                  email: true,
                  password: true
                }
              }
            }
          },
          updater: true
        }
      })

    })

    it('devrait lever une NotFoundException si le slot n\'existe pas', async () => {
      // ARRANGE : le mock renvoie null, comme si Prisma ne trouvait rien
      mockPrismaService.missionSlot.findUnique.mockResolvedValue(null)

      // ACT + ASSERT combinés : on s'attend à ce que l'appel ÉCHOUE
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })

  })




  describe('update', () => {
    it('devrait modifier un slot et renvoyer le résultat', async () => {

      // Le slot tel qu'il existe déjà en base — c'est ce que renverra
      // le findOne() interne appelé par update() avant de modifier quoi que ce soit
      const existingSlot = {
        id: 1,
        date: new Date('2026-01-01'),
        start_hour: new Date('1970-01-01T09:00:00'),
        end_hour: new Date('1970-01-01T12:00:00'),
        max_volunteers: 3,
        missionId: 5
      }

      // Les données qu'on souhaite modifier — ici on ne change que max_volunteers
      const updateDto = {
        max_volunteers: 5
      }

      // L'id de la personne qui fait la modification (stocké dans updatedById)
      const userId = 10

      // Ce que Prisma renverrait une fois la modification appliquée
      const expectedUpdatedSlot = {
        ...existingSlot,
        max_volunteers: 5,
        updatedById: userId
      }

      // 1 - ARRANGE : on configure DEUX mocks, car update() appelle findOne() en interne
      // avant de faire la vraie modification — sans ce premier mock, findOne() planterait
      mockPrismaService.missionSlot.findUnique.mockResolvedValue(existingSlot)
      // ce deuxième mock simule la réponse de la VRAIE modification
      mockPrismaService.missionSlot.update.mockResolvedValue(expectedUpdatedSlot)

      // 2 - ACT : on appelle la vraie méthode du service avec l'id, le dto, et le userId
      const result = await service.update(1, updateDto, userId)

      // 3 - ASSERT : on vérifie que le résultat renvoyé correspond à ce qu'on attend
      expect(result).toEqual(expectedUpdatedSlot)

      // On vérifie aussi que prisma.missionSlot.update a été appelé avec les bons arguments :
      // le bon id dans "where", et les bonnes données (max_volunteers modifié + updatedById ajouté)
      expect(mockPrismaService.missionSlot.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          max_volunteers: 5,
          updatedById: userId
        }
      })
    })
  })




  describe('remove', () => {
    it('devrait supprimer un slot existant', async () => {

      // Le slot existant, renvoyé par le findOne() interne appelé avant la suppression
      const existingSlot = {
        id: 1,
        date: new Date('2026-01-01'),
        start_hour: new Date('1970-01-01T09:00:00'),
        end_hour: new Date('1970-01-01T12:00:00'),
        max_volunteers: 3,
        missionId: 5
      }

      // 1 - ARRANGE : comme pour update(), remove() appelle findOne() en interne avant
      // de supprimer — il faut donc configurer findUnique en plus de delete
      mockPrismaService.missionSlot.findUnique.mockResolvedValue(existingSlot)
      mockPrismaService.missionSlot.delete.mockResolvedValue(existingSlot)

      // 2 - ACT
      const result = await service.remove(1)

      // 3 - ASSERT : vérifie le résultat ET que delete a été appelé avec le bon id
      expect(result).toEqual(existingSlot)

      expect(mockPrismaService.missionSlot.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })
  })



  describe('createMany', () => {
    it('devrait créer plusieurs slots et renvoyer ceux créés', async () => {

      // Les données qu'on envoie pour créer plusieurs slots d'un coup
      const createManyDto = {
        missionId: 5,
        slots: [
          {
            date: new Date('2026-01-01'),
            start_hour: '09:00',
            end_hour: '12:00',
            max_volunteers: 3
          },
          {
            date: new Date('2026-01-01'),
            start_hour: '12:00',
            end_hour: '15:00',
            max_volunteers: 3
          }
        ]
      }

      // Ce que la base contiendrait APRÈS la création — c'est ce que findMany()
      // renverra, puisque createMany() de Prisma ne renvoie qu'un compteur,
      // pas les enregistrements créés (rappel du choix qu'on avait fait)
      const expectedCreatedSlots = [
        {
          id: 1,
          date: createManyDto.slots[0].date,
          start_hour: new Date('1970-01-01T09:00:00'),
          end_hour: new Date('1970-01-01T12:00:00'),
          max_volunteers: 3,
          missionId: 5
        },
        {
          id: 2,
          date: createManyDto.slots[1].date,
          tart_hour: new Date('1970-01-01T12:00:00'),
          end_hour: new Date('1970-01-01T15:00:00'),
          max_volunteers: 3,
          missionId: 5
        }
      ]

      // 1 - ARRANGE : createMany() ne renvoie qu'un compteur, peu importe sa valeur ici
      mockPrismaService.missionSlot.createMany.mockResolvedValue({ count: 2 })
      // c'est findMany() qui renvoie les vrais slots créés, donc c'est lui qu'on vérifie
      mockPrismaService.missionSlot.findMany.mockResolvedValue(expectedCreatedSlots)

      // 2 - ACT
      const result = await service.createMany(createManyDto)

      // 3 - ASSERT : on vérifie juste le résultat final (les slots créés)
      // On ne vérifie pas les arguments exacts de createMany()/findMany() ici,
      // car findMany() utilise un timestamp dynamique (new Date() au moment de l'appel)
      // qu'on ne peut pas prédire facilement dans le test — c'est une limite acceptable
      expect(result).toEqual(expectedCreatedSlots)
    })
  })


  describe('findAll', () => {
    it('devrait renvoyer la liste de tous les slots', async () => {

      // La liste de slots qu'on s'attend à recevoir
      const expectedSlots = [
        { id: 1, date: new Date('2026-01-01'), start_hour: new Date('1970-01-01T09:00:00'), end_hour: new Date('1970-01-01T12:00:00'), max_volunteers: 3, missionId: 5 },
        { id: 2, date: new Date('2026-01-02'), start_hour: new Date('1970-01-01T09:00:00'), end_hour: new Date('1970-01-01T12:00:00'), max_volunteers: 2, missionId: 6 }
      ]

      // 1 - ARRANGE
      mockPrismaService.missionSlot.findMany.mockResolvedValue(expectedSlots)

      // 2 - ACT
      const result = await service.findAll()

      // 3 - ASSERT : vérifie le résultat et les arguments passés à findMany
      expect(result).toEqual(expectedSlots)

      expect(mockPrismaService.missionSlot.findMany).toHaveBeenCalledWith({
        include: {
          mission: true,
          userHasMissions: {
            include: {
              user: {
                omit: { email: true, password: true }
              }
            }
          },
          updater: true
        }
      })
    })
  })


});
