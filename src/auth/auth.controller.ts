import { Body, ConflictException, Controller, Get, NotFoundException, Patch, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { IResponse } from 'utils/interface/response.interface';
import { UserWTPwd } from 'src/user/interface/userWTPwd.interface';
import { LoginDto } from './dto/login.dto';
import { ChangePassword } from './dto/change-password.dto';
import { AuthGuard } from './guard/auth.guard';
import type { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) { }

  @Post('signup')
  async signup(@Body() signupData: CreateUserDto): Promise<IResponse<UserWTPwd>> {
    //on vérifie si l'email n'est pas déjà utilisé ou si l'utilisateur n'a pas déjà un compte
    if (await this.userService.countEmail(signupData.email)) throw new ConflictException("Email deja utilisé")


    await this.mailService.sendWelcomeEmail(
      signupData.email,
      signupData.firstname,
      signupData.password
    )

    // créer le user dans la DB
    const newUser: UserWTPwd = await this.userService.create(signupData)

    return {
      data: newUser,
      timeStamp: new Date(),
      url: "auth/signup"
    }
  }


  // Res: décorateur qui donne accès à l'objet réponse HTTP : permet de donner un cookie
  @Post('login')
  async login(@Body() loginData: LoginDto, @Res({ passthrough: true }) res: Response): Promise<IResponse<{ accessToken: string }>> {

    // Récupérer les infos de l'utilisateur et vérifier s'il existe
    const userData = await this.userService.findOneByEmail(loginData.email)
    if (!userData) throw new NotFoundException('Email ou mot de passe incorrect')

    //On compare les mdp
    if (!await this.authService.compare(loginData.password, userData.password)) throw new NotFoundException('Email ou mot de passe incorrect')

    // Créer les tokens

    const { accessToken, refreshToken } = await this.authService.createTokens(userData.id, userData.role)

    // Stocker le refreshToken dans un cookie httpOnly
    // dit au navigateur "stocke ce token JWT dans un cookie nommé refreshToken, garde le 7 jours et ne laisse pas JS y toucher"
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // JS ne peut pas le lire
      secure: true, // false en dev (HTTP), true en prod (HTTPS)
      sameSite: 'strict', // envoyé seulement depuis mon propre site
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours en ms
    })

    return {
      data: { accessToken },
      timeStamp: new Date(),
      url: "auth/login"
    }
  }



  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<IResponse<{ accessToken: string }>> {

    // Lire le refresh token depuis le cookie
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) throw new UnauthorizedException('Refresh token manquant')

    // Vérifier le token et récupérer le payload
    const payload = await this.authService.verifyRefreshToken(refreshToken)

    // Générer un nouvel accessToken

    const user = await this.userService.findOne(payload.sub)
    if (!user) throw new UnauthorizedException('Utilisateur introuvable')
    const { accessToken } = await this.authService.createTokens(payload.sub, user.role)

    return {
      data: { accessToken },
      timeStamp: new Date(),
      url: "auth/refresh"
    }
  }


  @UseGuards(AuthGuard)
  @Patch('newpassword')
  async changepassword(@Req() req, @Body() changePassword: ChangePassword): Promise<void> {

    const user = await this.userService.findOneWithPassword(req.user.id)

    if (!user) throw new NotFoundException('Email ou mot de passe incorrect')

    if (!await this.authService.compare(changePassword.password, user.password)) throw new NotFoundException('Mot de passe incorrect')

    changePassword.newpassword = await this.authService.hash(changePassword.newpassword)

    const newUser: UserWTPwd = await this.userService.update(req.user.id, {
      password: changePassword.newpassword,
      mustChangePassword: false
    })

  }


  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response): Promise<void> {

    res.clearCookie('refreshToken')
  }






  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {

    // Vérifier si l'utilsateur existe
    const user = await this.userService.findOneByEmail(body.email)

    if (!user) return
    if (!user.isOnboarded) return

    // Génère le token
    const { token, expires } = await this.authService.generateResetToken()

    // Sauvegarder le token en base
    await this.userService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    await this.mailService.sendChangePasswordEmail(user.email, resetLink)
  }






  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findOneByResetToken(body.token)

    if (!user) throw new NotFoundException('Token invalide')

    //Vérifie que le token n'est pas expiré
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Token expiré')
    }

    // hasher le nouveau mot de passe
    const hashedPassword = await this.authService.hash(body.newPassword)

    //Mets à jour le mot de passe et supprime le token
    await this.userService.update(user.id, {
      password: hashedPassword,
      resetPasswordExpires: null,
      resetPasswordToken: null
    })
  }

  @Get('test')
testRoute() {
    return "ok"
}

}