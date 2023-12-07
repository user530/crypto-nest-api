import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceTimestamp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timestamp: Date;

    @Column({ name: 'open_price' })
    openPrice: number;

    @Column({ name: 'high_price' })
    highPrice: number;

    @Column({ name: 'low_price' })
    lowPrice: number;

    @Column({ name: 'close_price' })
    closePrice: number;
}