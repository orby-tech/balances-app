import { Test, TestingModule } from '@nestjs/testing';
import { BalancesResolver } from './balances.resolver';

describe('BalancesResolver', () => {
  let resolver: BalancesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalancesResolver],
    }).compile();

    resolver = module.get<BalancesResolver>(BalancesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
