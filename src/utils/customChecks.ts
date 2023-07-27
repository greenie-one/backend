import { SelectedFieldsDTO } from '@/dtos/request/workExPeer.dto';
import { SelectedFields } from '@/models/workExPeer.model';
import { WorkExperience } from '@/models/workExperience.model';

export function checkPropertiesExist(check: object, from: object) {
  const checkClassProperties = Object.keys(check);

  const missingProperties = [];
  for (const property of checkClassProperties) {
    if (!Object.hasOwn(from, property)) {
      missingProperties.push(property);
    }
  }
  if (missingProperties.length) {
    throw new Error(`Missing properties in Document: ${missingProperties.join(', ')}`);
  }
  return missingProperties;
}

export function registerPropertiesCheck() {
  checkPropertiesExist(new SelectedFields(), new WorkExperience());
  checkPropertiesExist(new SelectedFields(), new SelectedFieldsDTO());
}
