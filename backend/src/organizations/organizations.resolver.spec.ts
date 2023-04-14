import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from './organizations.resolver';

describe('OrganizationsResolver', () => {
  let resolver: OrganizationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsResolver],
    }).compile();

    resolver = module.get<OrganizationsResolver>(OrganizationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
