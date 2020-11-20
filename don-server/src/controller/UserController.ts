import { Controller, Get, Post, Put, Request, Response, Route, Body, Path, Query } from 'tsoa';
import { UserRoles } from '../common';
import UserService from '../services/UserService';

// TODO: check old routes for params like res, req, and additional query params

@Route('/users')
export class Users extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Response('400', 'Bad request')
  @Get('/profile')
  public async getUserRole(@Request() req: Express.Request): Promise<UserRoles> {
    if ((req.session as any)?.user) {
      return this.userService.getUserRole((req.session as any).user._id);
    }

    throw new Error('No user provided in request object!');
  }

  @Response('400', 'Bad request')
  @Put('/profile')
  public async updateProfile(@Request() _req: any, @Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/agency')
  public async createAgency(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Get('/agency/wish-card')
  public async getAgencyWishCards(@Request() _req: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/sign-up')
  public async signUpUser(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/google')
  public async googleLogin(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/facebook')
  public async facebookLogin(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/login')
  public async login(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Get('/logout')
  public async logout(@Request() _req: any, @Query() _query: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Get('/verify/{hash}')
  public async verify(@Path('hash') _hash: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Get('/choose')
  public async choose(@Query() _query: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/password/reset')
  public async resetPassword(@Body() _body: any): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Get('/password/reset/{token}')
  public async getPasswordResetToken(
    @Path('token') _token: any,
    @Query() _query: any,
  ): Promise<void> {
    // TODO: implementation needed
  }

  @Response('400', 'Bad request')
  @Post('/password/reset/{token}')
  public async confirmPasswordReset(
    @Request() _req: any,
    @Path('token') _token: any,
    @Body() _body: any,
  ): Promise<void> {
    // TODO: implementation needed
  }
}
