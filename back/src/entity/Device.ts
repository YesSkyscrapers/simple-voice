import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 200
    })
    deviceId: string

    @Column({
        length: 20
    })
    login: string
}
