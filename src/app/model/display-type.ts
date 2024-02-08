export default class DisplayType {

    static List: string = "List";
    static Grid: string = "Grid";

    public static listAll(): string[] {
        let all = [
            DisplayType.List,
            DisplayType.Grid
        ];

        return all;
    }

}
