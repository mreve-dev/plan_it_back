import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
//génère des chapines de caractères aléatoires
import * as crypto from 'crypto'
import { RoleEnum } from 'prisma/generated/prisma/enums';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) { }

    async hash(password: string): Promise<string> {
        const hashedPwd = await argon2.hash(password)
        return hashedPwd
    }

    async compare(pwd: string, hashedPwd: string): Promise<boolean> {
        const result = await argon2.verify(hashedPwd, pwd)

        return result
    }

    async createTokens(id: number, role: RoleEnum): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = { sub: id, role: role }
        const accessToken = await this.jwtService.signAsync(payload,
            {
                expiresIn: process.env.ACCESEXPIRE ?? "7d" as any,
                algorithm: process.env.JWTALGORITHM ?? 'HS512' as any,
                secret: process.env.ACCESSSECRET as any
            }
        )
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.REFRESHEXPIRE ?? "7d" as any,
            algorithm: process.env.JWTALGORITHM ?? 'HS512' as any,
            secret: process.env.REFRESHSECRET as any
        })

        return { accessToken, refreshToken }
    }

    async verifyRefreshToken(refreshToken: string): Promise<{ sub: number }> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.REFRESHSECRET as string
            })
            return payload
        } catch (error) {
            throw new UnauthorizedException('Refresh token invalide ou expiré')
        }
    }

    async generateResetToken(): Promise<{ token: string, expires: Date }> {
        // génère une chaîne aléatoire de 32 octets en hexadecimal
        const token = crypto.randomBytes(32).toString('hex')

        //expire dans 1h, datetime retourne le stimestamp actuel en millisecondes et on ajoute 1h (3 600 000ms)

        const expires = new Date(Date.now() + 60 * 60 * 1000)

        return { token, expires }
    }
}