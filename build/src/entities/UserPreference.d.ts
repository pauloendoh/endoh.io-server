import { User } from './User';
export declare class UserPreference {
    id: number;
    user: User;
    relearnAutofillURL: boolean;
    relearnLastAccessedRoute: string;
    skillbaseSidebarIsOpen: boolean;
    skillbaseSortSkill: {
        sortBy: string;
        order: "asc" | "desc";
    };
    skillbaseTextFilter: string;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
