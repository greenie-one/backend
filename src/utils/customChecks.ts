import { OptionalWorkExFields } from '@/models/peer.model';
import { WorkExperience } from '@/models/workExperience.model';

export function checkPropertiesExist(check, from) {
  const checkClassProperties = Object.keys(check);
  const fromClassProperties = Object.keys(from);

  const missingProperties = [];
  for (const property of checkClassProperties) {
    if (!fromClassProperties.includes(property)) {
      missingProperties.push(property);
    }
  }
  if (missingProperties.length) {
    throw new Error(`Missing properties in Document: ${missingProperties.join(', ')}`);
  }
  return missingProperties;
}

export function registerPropertiesCheck() {
  checkPropertiesExist(new OptionalWorkExFields(), new WorkExperience());
}
