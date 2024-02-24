export default class IncludeType {

    static Include: string = "Include";
    static Exclude: string = "Exclude";
    static Ignore: string = "Ignore";

    public static listAll(): string[] {
        let all = [
            IncludeType.Include,
            IncludeType.Exclude,
            IncludeType.Ignore
        ];

        return all;
    }

}
