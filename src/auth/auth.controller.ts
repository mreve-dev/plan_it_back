import { Body, ConflictException, Controller, NotFoundException, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'prisma/generated/prisma/client';
import { IResponse } from 'utils/interface/response.interface';
import { UserWTPwd } from 'src/user/interface/userWTPwd.interface';
import { LoginDto } from './dto/login.dto';
import { ChangePassword } from './dto/change-password.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @Post('signup')
  async signup(@Body() signupData: CreateUserDto): Promise<IResponse<UserWTPwd>> {
    //on vérifie si l'email n'est pas déjà utilisé ou si l'utilisateur n'a pas déjà un compte
    if (await this.userService.countEmail(signupData.email)) throw new ConflictException("Email deja utilisé")

    //on hash le MDP
    signupData.password = await this.authService.hash(signupData.password)

    // créer le user dans la DB
    const newUser: UserWTPwd = await this.userService.create(signupData)

    return {
      data: newUser,
      timeStamp: new Date(),
      url: "auth/signup"
    }
  }

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<IResponse<{ accessToken: string, refreshToken: string }>> {

    // Récupérer les infos de l'utilisateur et vérifier s'il existe
    const userData = await this.userService.findOneByEmail(loginData.email)
    if (!userData) throw new NotFoundException('Email ou mot de passe incorrect')

    //On compare les mdp
    if (!await this.authService.compare(loginData.password, userData.password)) throw new NotFoundException('Email ou mot de passe incorrect')

    // Créer les tokens

    const { accessToken, refreshToken } = await this.authService.createTokens(userData.id)

    return {
      data: { accessToken, refreshToken },
      timeStamp: new Date(),
      url: "auth/login"
    }
  }

  @UseGuards(AuthGuard)
  @Patch('newpassword')
  async changepassword(@Req() req, @Body() changePassword : ChangePassword) : Promise<void> {

    const user = await this.userService.findOne(req.user)

    if(!user) throw new NotFoundException('Email ou mot de passe incorrect')

    if (!await this.authService.compare(changePassword.password, user.password)) throw new NotFoundException('Mot de passe incorrect')

    changePassword.newpassword = await this.authService.hash(changePassword.newpassword)

    const newUser : UserWTPwd = await this.userService.update(req.user, {
      password : changePassword.newpassword,
      mustChangepassword: false
    })
    
  }
}