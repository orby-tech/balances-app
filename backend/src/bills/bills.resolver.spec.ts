import { Test, TestingModule } from '@nestjs/testing';
import { BillsResolver } from './bills.resolver';

describe('BillsResolver', () => {
  let resolver: BillsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillsResolver],
    }).compile();

    resolver = module.get<BillsResolver>(BillsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
