export interface ISearchUserPost {
    email: string;
    user_id: string;
    list_id: string;

}

export class SearchUserPost implements ISearchUserPost {
    constructor() {
    }

    email: string;
    user_id: string;
    list_id: string;
}


export default class CreatUserStatus {

    static Success: string = "Success";
    static NameNotAvailable: string = "NameNotAvailable";
    static PasswordsDontMatch: string = "PasswordsDontMatch";
    static EmailTooShort: string = "EmailTooShort";


}