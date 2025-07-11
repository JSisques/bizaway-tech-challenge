export class TripInMemoryEntity {
  constructor(
    public readonly id: string,
    public readonly origin: string,
    public readonly destination: string,
    public readonly cost: number,
    public readonly duration: number,
    public readonly type: string,
    public readonly displayName: string,
  ) {}
}
