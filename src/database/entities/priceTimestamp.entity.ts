import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceTimestamp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({ name: 'open_price', type: 'float' })
    openPrice: number;

    @Column({ name: 'high_price', type: 'float' })
    highPrice: number;

    @Column({ name: 'low_price', type: 'float' })
    lowPrice: number;

    @Column({ name: 'close_price', type: 'float' })
    closePrice: number;
}