import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    authorId: number

    @Column({
        length: 2000
    })
    message: string

    @Column({
        length: 100
    })
    time: string
}
