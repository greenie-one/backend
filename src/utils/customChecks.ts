import { OptionalWorkExperienceFields } from '@/models/peer.model';
import { WorkExperience } from '@/models/workExperience.model';

export function checkPropertiesExist(check: object, from: object) {
  const checkClassProperties = Object.keys(check);

  const missingProperties = [];
  for (const property of checkClassProperties) {
    if (!from.hasOwnProperty(property)) {
      missingProperties.push(property);
    }
  }
  if (missingProperties.length) {
    throw new Error(`Missing properties in Document: ${missingProperties.join(', ')}`);
  }
  return missingProperties;
}

export function registerPropertiesCheck() {
  checkPropertiesExist(new OptionalWorkExperienceFields(), new WorkExperience());
}

