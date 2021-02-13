import { IUser } from '@/common/interfaces';
import { ERROR_CODE, USER } from '@/constants';
import { UserRepository } from '@/repositories';
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('addUser')
  async handleAddUser(@ConnectedSocket() socket: Socket, @MessageBody() data: string | any) {
    try {
      const payload: IUser = this.jwtService.verify(data, { ignoreExpiration: true });
      if (!payload || !payload.id) {
        throw new BadRequestException(ERROR_CODE.INVALID_PAYLOAD);
      }
      if (payload.exp * 1000 < Date.now()) {
        throw new UnauthorizedException(ERROR_CODE.EXPIRED_TOKEN);
      }
      const user = await this.userRepository.findOne({ id: payload.id });
      if (!user) {
        throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
      }
      if (user.status === USER.STATUS.NOT_ACTIVATED) {
        throw new UnauthorizedException(ERROR_CODE.USER_NOT_ACTIVATED);
      }
      if (user.status === USER.STATUS.IS_DISABLED) {
        throw new ForbiddenException(ERROR_CODE.DISABLED_USER);
      }
      socket.join(`${user.id}`);
      return `${user.username} joined!`;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  handleNewNotification(room: string, data: any) {
    this.server.to(room).emit('newNotification', data);
  }
}
