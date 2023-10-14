import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column()
    createAt: Date;

    @Column()
    updateAt: Date;

    @Column({
        default: 'https://sa-proj-restaurant.s3.amazonaws.com/defaultProfile.jpeg',
      })
    profilePictureUrl: string;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}