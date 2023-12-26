import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class QrCodeService {
	constructor(private readonly usersService: UsersService) {}

	private qrCodeStore: Record<number, string> = {};
	async generateQrCode(userId: number): Promise<string> {
		const user = await this.usersService.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		if (!user.is2FAEnabled) {
			throw new Error('2fa not enabled');
			}

		const generatedCode = Math.random().toString(36).slice(2);
		this.qrCodeStore[userId] = generatedCode;
		
		const qrCodeData = {
			userId: user.id,
			username: user.username,
			code: generatedCode,
		};
		const qrCodeUrl = await qrcode.toDataURL(JSON.stringify(qrCodeData));
		return qrCodeUrl;
	}
	async verifyQrCode(userId: number, code: string): Promise<string> {
	const user = await this.usersService.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}
		const storedCode = this.qrCodeStore[userId];
		if (!storedCode) {
			throw new Error('QR code not found for this user');
		}

		if (code === storedCode) {
			delete this.qrCodeStore[userId];
			return 'QR code verified successfully';
		} else {
			throw new Error('Invalid QR code');
		}
}
}