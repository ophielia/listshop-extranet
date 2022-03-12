  export default class TagType {

  static TagType: string = "TagType";
  static Rating: string = "Rating";
  static Ingredient: string = "Ingredient";
  static DishType: string = "DishType";
  static NonEdible: string = "NonEdible";

  public static listAll(): string[] {
    let all = [
      TagType.DishType,
      TagType.Ingredient,
      TagType.TagType,
      TagType.Rating,
      TagType.NonEdible
    ];

    return all;
  }




}
