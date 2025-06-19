export class CreateTripDto {
  constructor(
    public readonly origin: string,
    public readonly destination: string,
    public readonly cost: number,
    public readonly duration: number,
    public readonly type: string,
  ) {}
}
