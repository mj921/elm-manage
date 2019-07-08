import * as Enums from "../config/Enums";

export const enumsToList = function(type, allFlag = true) {
  if (allFlag) {
    return Object.keys(Enums[type]).map(key => {
      return {
        value: Enums[type][key],
        label: Enums[type + "Text"][key]
      };
    });
  } else {
    return Object.keys(Enums[type]).filter(key => Enums[type][key] !== Enums.ALL).map(key => {
      return {
        value: Enums[type][key],
        label: Enums[type + "Text"][key]
      };
    });
  }
};