import { Test, TestingModule } from "@nestjs/testing"
import { EventService } from "./event.service"
import { PrismaService } from "prisma/prisma.service"
import { NotFoundException } from "@nestjs/common"

describe('EventService', () => {
    let service: EventService
    let prisma: PrismaService;

    // Mock de PrismaService : on remplace les vraies méthodes par des fonctions factices
    const mockPrismaService = {
        evnt: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                { provide: PrismaService, useValue: mockPrismaService }
            ],
        }).compile();

        service = module.get<EventService>(EventService)
        prisma = module.get<PrismaService>(PrismaService)
    })


    afterEach(() => {
        jest.clearAllMocks()
    })


    describe('create', () => {

        it('devrait créer un event et renvoyer le résultat', async () => {

            // 1 - ARRANGE : prépare les données du test
            const dto = {
                name: "test",
                start_date: new Date('2026-01-01'),
                end_date: new Date('2026-01-03'),
                start_hour: '09:00',
                end_hour: '12:00',
                description: "hello",
                categoryId: 4,
                creatorId: 2
            }

            const expectedEvent = {
                id: 1,
                name: dto.name,
                start_date: dto.start_date,
                end_date: dto.end_date,
                start_hour: new Date(`1970-01-01T${dto.start_hour}:00`),
                end_hour: new Date(`1970-01-01T${dto.end_hour}:00`),
                descrption: dto.description,
                categoryId: dto.categoryId,
                creatorId: dto.creatorId
            }

            // 2 - dis au mock quoi renvoyer quand create() sera appelé
            mockPrismaService.evnt.create.mockResolvedValue(expectedEvent)

            // 3 - ACT : appelle la vraie methode du service
            const result = await service.create(dto)


            // 4 - ASSERT : vérifie le résultat en comparant result et les données de expectedSlot.
            expect(result).toEqual(expectedEvent)


            // Cette nouvelle ligne vérifie précisément ce que le service a réellement envoyé à prisma.missionSlot.create(...) — donc si jamais quelqu'un cassait la transformation des dates dans le vrai code du service, ce test échouerait et nous préviendrait.
            expect(mockPrismaService.evnt.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    start_date: dto.start_date,
                    end_date: dto.end_date,
                    start_hour: new Date(`1970-01-01T${dto.start_hour}:00`),
                    end_hour: new Date(`1970-01-01T${dto.end_hour}:00`),
                    description: dto.description,
                    categoryId: dto.categoryId,
                    creatorId: dto.creatorId

                }
            })
        });



    })


    describe('findByUser', () => {
        it("devrait trouver les evenemnts d'un user et les renvoyer", async () => {
            // 1 - ARRANGE : prépare les données du test
            const expectedEvent = [
                {
                    id: 3,
                    name: "test",
                    start_date: new Date('2026-01-01'),
                    end_date: new Date('2026-01-03'),
                    start_hour: '09:00',
                    end_hour: '12:00',
                    description: "hello",
                    categoryId: 4,
                    creatorId: 2
                },
                {
                    id: 4,
                    name: "test",
                    start_date: new Date('2026-01-01'),
                    end_date: new Date('2026-01-03'),
                    start_hour: '09:00',
                    end_hour: '12:00',
                    description: "hello",
                    categoryId: 4,
                    creatorId: 2
                }
            ]

            const userId = 5

            // 2 - dis au mock quoi renvoyer quand create() sera appelé
            mockPrismaService.evnt.findMany.mockResolvedValue(expectedEvent)

            // 3 - ACT : appelle la vraie methode du service
            const result = await service.findByUser(userId)


            // 4 - ASSERT : vérifie le résultat en comparant result et les données de expectedSlot.
            expect(result).toEqual(expectedEvent)


            // Cette nouvelle ligne vérifie précisément ce que le service a réellement envoyé à prisma.missionSlot.create(...) — donc si jamais quelqu'un cassait la transformation des dates dans le vrai code du service, ce test échouerait et nous préviendrait.
            expect(mockPrismaService.evnt.findMany).toHaveBeenCalledWith({
                where: {
                    missions: {
                        some: {
                            missionSlots: {
                                some: {
                                    userHasMissions: {
                                        some: {
                                            userId: userId
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                include: {
                    category: true,
                    missions: {
                        include: {
                            missionSlots: {
                                include: {
                                    userHasMissions: true
                                }
                            }
                        }
                    }
                }
            })


        })
    })













    describe('findOne', () => {
        it('devrait trouver un event et renvoyer le résultat', async () => {

            // 1 - ARRANGE : prépare les données du test
            const expectedEvent = {
                id: 3,
                name: "test",
                start_date: new Date('2026-01-01'),
                end_date: new Date('2026-01-03'),
                start_hour: '09:00',
                end_hour: '12:00',
                description: "hello",
                categoryId: 4,
                creatorId: 2
            }



            // 2 - dis au mock quoi renvoyer quand create() sera appelé
            mockPrismaService.evnt.findUnique.mockResolvedValue(expectedEvent)

            // 3 - ACT : appelle la vraie methode du service
            const result = await service.findOne(expectedEvent.id)


            // 4 - ASSERT : vérifie le résultat en comparant result et les données de expectedSlot.
            expect(result).toEqual(expectedEvent)


            // Cette nouvelle ligne vérifie précisément ce que le service a réellement envoyé à prisma.missionSlot.create(...) — donc si jamais quelqu'un cassait la transformation des dates dans le vrai code du service, ce test échouerait et nous préviendrait.
            expect(mockPrismaService.evnt.findUnique).toHaveBeenCalledWith({
                where: { id: 3 },
                include: {
                    category: true,
                    missions: {
                        include: {
                            missionSlots: {
                                include: {
                                    userHasMissions: {
                                        include: {
                                            user: {
                                                omit: {
                                                    email: true,
                                                    password: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    eventHasDocument: {
                        include: { document: true }
                    }
                }
            })
        });

        it("devrait lever une NotFoundException si l'event n'existe pas", async () => {
            // ARRANGE : le mock renvoie null, comme si Prisma ne trouvait rien
            mockPrismaService.evnt.findUnique.mockResolvedValue(null)

            // ACT + ASSERT combinés : on s'attend à ce que l'appel ÉCHOUE
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
        })
    })

    describe('update', () => {
        it('devrait modifier un slot et renvoyer le résultat', async () => {

            // Le slot tel qu'il existe déjà en base — c'est ce que renverra
            // le findOne() interne appelé par update() avant de modifier quoi que ce soit
            const existingEvent = {
                id: 3,
                name: "test",
                start_date: new Date('2026-01-01'),
                end_date: new Date('2026-01-03'),
                start_hour: '09:00',
                end_hour: '12:00',
                description: "hello",
                categoryId: 4,
                creatorId: 2
            }

            // Les données qu'on souhaite modifier — ici on ne change que max_volunteers
            const updateDto = {
                name: "bobby"
            }

            // L'id de la personne qui fait la modification (stocké dans updatedById)
            const userId = 10

            // Ce que Prisma renverrait une fois la modification appliquée
            const expectedUpdatedEvent = {
                ...existingEvent,
                name: "bobby",
                updatedById: userId
            }

            // 1 - ARRANGE : on configure DEUX mocks, car update() appelle findOne() en interne
            // avant de faire la vraie modification — sans ce premier mock, findOne() planterait
            mockPrismaService.evnt.findUnique.mockResolvedValue(existingEvent)
            // ce deuxième mock simule la réponse de la VRAIE modification
            mockPrismaService.evnt.update.mockResolvedValue(expectedUpdatedEvent)

            // 2 - ACT : on appelle la vraie méthode du service avec l'id, le dto, et le userId
            const result = await service.update(1, updateDto, userId)

            // 3 - ASSERT : on vérifie que le résultat renvoyé correspond à ce qu'on attend
            expect(result).toEqual(expectedUpdatedEvent)

            // On vérifie aussi que prisma.missionSlot.update a été appelé avec les bons arguments :
            // le bon id dans "where", et les bonnes données (max_volunteers modifié + updatedById ajouté)
            expect(mockPrismaService.evnt.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: "bobby",
                    updatedById: userId
                }
            })
        })
    })

    describe('remove', () => {
        it('devrait supprimer un slot existant', async () => {

            // Le event existant, renvoyé par le findOne() interne appelé avant la suppression
            const existingEvent = {
                id: 3,
                name: "test",
                start_date: new Date('2026-01-01'),
                end_date: new Date('2026-01-03'),
                start_hour: '09:00',
                end_hour: '12:00',
                description: "hello",
                categoryId: 4,
                creatorId: 2
            }

            // 1 - ARRANGE : comme pour update(), remove() appelle findOne() en interne avant
            // de supprimer — il faut donc configurer findUnique en plus de delete
            mockPrismaService.evnt.findUnique.mockResolvedValue(existingEvent)
            mockPrismaService.evnt.delete.mockResolvedValue(existingEvent)

            // 2 - ACT
            const result = await service.remove(1)

            // 3 - ASSERT : vérifie le résultat ET que delete a été appelé avec le bon id
            expect(result).toEqual(existingEvent)

            expect(mockPrismaService.evnt.delete).toHaveBeenCalledWith({
                where: { id: 1 }
            })
        })
    })



})