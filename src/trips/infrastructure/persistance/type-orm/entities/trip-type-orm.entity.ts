import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('trips')
export class TripTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 3 })
  origin: string;

  @Column({ type: 'varchar', length: 3 })
  destination: string;

  @Column({ type: 'integer' })
  cost: number;

  @Column({ type: 'integer' })
  duration: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  displayName: string;
}
