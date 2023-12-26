import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class QrCodeService {
	constructor(private readonly usersService: UsersService) {}
	async generateQrCode(userId: number): Promise<string> {
	const user = await this.usersService.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}

	if (!user.is2FAEnabled) {
		throw new Error('2fa not enabled');
		}

	const qrCodeData = {
		userId: user.id,
		username: user.username,
	};
	const qrCodeUrl = await qrcode.toDataURL(JSON.stringify(qrCodeData));
	return qrCodeUrl;
	}
	async verifyQrCode(userId: number, code: string): Promise<string> {
	const user = await this.usersService.findById(userId);
	
	
	if (!user) {
		throw new Error('User not found');
	}

	//verif a ajouter
	return 'QR code verified successfully';
	}
} 