export const add_item = (payload) => ({
  type: "ADD_ITEM",
  payload,
});

export const plus_one_item = (payload) => ({
  type: "PLUS_ONE_ITEM",
  payload,
});

export const minus_one_item = (payload) => ({
  type: "MINUS_ONE_ITEM",
  payload,
});

export const remove_item = (payload) => ({
  type: "REMOVE_ITEM",
  payload,
});

export const clear_items = {
  type: "CLEAR_ITEMS",
};

export const toggle_modal = {
  type: "TOGGLE_MODAL",
};
