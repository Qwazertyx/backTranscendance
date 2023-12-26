import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNotEmpty,
	IsEmail,
	MinLength,
	MaxLength,
} from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@ApiProperty()
	password: string;
}

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	password: string;
}

export class TokenDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	token: string;

	@ApiProperty()
	id: number;
}