import { SetMetadata } from "@nestjs/common";

// Métadonnée: info rattachée à la fonction. Donne des inforamtions sur quelque chose

// SetMetaData: stocke les rôles comme métadonnée sur la route, c'est ce que le reflector va lire ensuite
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)