import applicabilityRepositiry from './entity/applicabilityRepositiry';
import copiesInfoRepository from './entity/copiesInfoRepository';
import directoryRepository from './entity/directoryRepository';
import employeeRepository from './entity/employeeRepository';
import formatRepository from './entity/formatRepository';
import inventoryCardRepository from './entity/inventoryCardRepository';
import onceOnlyIssueRepository from './entity/onceOnlyIssueRepository';
import stocktakingRepository from './entity/stocktakingRepository';
import subscriberRepository from './entity/subscriberRepository';
import themeRepository from './entity/themeRepository';

const repositories = {
  applicability: applicabilityRepositiry,
  copiesInfo: copiesInfoRepository,
  directory: directoryRepository,
  employee: employeeRepository,
  format: formatRepository,
  inventoryCard: inventoryCardRepository,
  onceOnlyIssue: onceOnlyIssueRepository,
  stocktaking: stocktakingRepository,
  subscriber: subscriberRepository,
  theme: themeRepository
};

export const RepositoryFactory = {
  get: name => repositories[name]
};
