export class SearchTripQuery {
  constructor(
    public readonly origin: string,
    public readonly destination: string,
    public readonly sortBy: 'fastest' | 'cheapest' = 'fastest',
  ) {}
}
