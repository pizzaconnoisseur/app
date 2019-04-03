/**
 * One could add various displays and data filtering here.
 * You'd just need to define the views property and an additional selector that gets
 * the graph's data when the view is selected.
 */
const views = {
  topRanked: {
    id: 0,
    label: "Top Ranked",
    description: "This report shows you top quality pizzas you can make from the specified ingredients.",
  },
  lowestRanked: {
    id: 1,
    label: "Lowest Ranked",
    description: "This report shows you the worst pizzas you can make from the specified ingrediends.",
  }
}

/**
 * These colors start to repeat once the number of properties is greater than it's length.
 * Possibly difficult to read.
 */
const colors = ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43"];

export { views, colors };