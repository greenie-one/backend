import { State } from '@/models/peer.model';
import { GetDocumentResponseDto } from './document.response';
import { SkillResponseDto } from './skills.response';

export interface GetSharedResponseDTO {
  id: string;
  state: State;
  data: SkillResponseDto | GetDocumentResponseDto;
}

