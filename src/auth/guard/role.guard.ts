
import {
    
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

    // reflector: outil de NestJS permettant de lire les métadonnées, ici les rôles qu'on mets avec @Roles('admin')
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {

        // Va chercher la métadonnée 'role' sur la méthode : getHandler = fonction create
        // ou sur le controller entier avec getClass
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])

        // Si la route n'as pas de @Roles, tout le monde peut y accéder, pas de restriction
        if (!requiredRoles) return true

        // Récupère user depuis la requête et vérifie ensuitesi le rôle de l'utilisateur est dans la liste des rôles autorisés
        const {user} = context.switchToHttp().getRequest()
        return requiredRoles.includes(user.role)
        
    }

}