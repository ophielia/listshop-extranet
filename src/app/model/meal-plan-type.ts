export default class MealPlanType {

  static Manual: string = "Manual";
  static Targeted: string = "Targeted";

  public static listAll(): string[] {
    let all = [
      MealPlanType.Manual,
      MealPlanType.Targeted
    ];

    return all;
  }

}
