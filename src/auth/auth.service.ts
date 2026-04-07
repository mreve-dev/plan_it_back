import { Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

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
    
    async createTokens(id: number): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = { sub: id }
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
}