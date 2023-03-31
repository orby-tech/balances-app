import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesResolver } from './currencies.resolver';

describe('CurrenciesResolver', () => {
  let resolver: CurrenciesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesResolver],
    }).compile();

    resolver = module.get<CurrenciesResolver>(CurrenciesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
