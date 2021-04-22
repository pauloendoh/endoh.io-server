import { Resource } from '../../entities/relearn/Resource';
import { Skill } from '../../entities/skillbase/Skill';
import { UserProfileDto } from '../feed/UserProfileDto';
export interface SearchResultsDto {
    resources: Resource[];
    users: UserProfileDto[];
    skills: Skill[];
}
