import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    username: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({
        default: 'https://sa-proj-restaurant.s3.amazonaws.com/defaultProfile.jpeg',
      })
    profilePictureUrl: string;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}